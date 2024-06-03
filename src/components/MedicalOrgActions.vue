<template>
  <div class="form">
    <div class="form__row">
      <div class="form__input">
        <input :class="{ 'input': doctorAddress }" v-model="doctorAddress" id="dctor-eth" />
        <label for="dctor-eth">Doctor Etherium address</label>
      </div>
      <div class="form__input">
        <input id="doctor-name" :class="{ 'input': doctorName }" v-model="doctorName" />
        <label for="doctor-name">Doctor Name</label>
      </div>
      <button @click="addDoctor">Add Doctor</button>
    </div>

    <h2 class="title" v-if="doctors.length > 0">Remove doctor</h2>

    <!-- <select v-model="selectedDoctor">
        <option v-for="doctor in doctors" :key="doctor.address" :value="doctor.address">
          {{ doctor.name }}
        </option>
      </select>
      <button @click="() => { console.log('dasd'); }">Remove Doctor</button> -->
    <div class="users">
      <div class="users__item" v-for="doctor in doctors" :key="doctor.address">
        <div class="users__title">{{ doctor.name }}</div>
        <div class="users__button" @click="() => { removeDoctor(doctor.address) }">
          Delete
        </div>
      </div>
    </div>

    <div class="info">
      <div class="info__data" v-show="true">
        <div class="info__input">
          <p>{{ userInfo ? userInfo.firstName : 'First Name' }}</p>
          <label v-if="userInfo">First Name</label>
        </div>
        <div class="info__input">
          <p>{{ userInfo ? userInfo.lastName : 'Last Name' }}</p>
          <label v-if="userInfo">Last Name</label>
        </div>
        <div class="info__input">
          <p>{{ userInfo ? userInfo.phoneNumber : 'Phone Number' }}</p>
          <label v-if="userInfo">Phone Number</label>
        </div>
        <div class="info__grid">
          <div class="info__input">
            <p>{{ userInfo ? userInfo.email : 'Email' }}</p>
            <label v-if="userInfo">Email</label>
          </div>
          <div class="info__input">
            <p>{{ userInfo ? userInfo.age : 'Age' }}</p>
            <label v-if="userInfo">Age</label>
          </div>
        </div>
        <div class="info__input big">
          <p>{{ userInfo ? userInfo.medicalHistory : 'Medical History' }}</p>
          <label v-if="userInfo">Medical History</label>
        </div>
      </div>
      <div class="info__form">
        <div class="info__form-input">
          <input :class="{ 'input': userAddress }" id="user-eth" v-model="userAddress" />
          <label for="user-eth">User Ethereum Address</label>
        </div>
        <div class="info__form-input">
          <input :class="{ 'input': privateKey }" id="private-key" v-model="privateKey" />
          <label for="private-key">Your private key</label>
        </div>
        <button @click="decryptUserData">Decrypt User Data</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import axios from 'axios';
import { contractABI, contractAddress } from '@/components/config.js';
import { decryptData } from '@/components/encryption.js';

export default {
  data() {
    return {
      userInfo: null,
      userAddress: '',
      privateKey: '',
      doctorAddress: '',
      doctorName: '',
      doctors: [],
      selectedDoctor: '',
      account: ''
    };
  },
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        this.account = await signer.getAddress();
        await this.fetchDoctors();
      } else {
        alert('Please install MetaMask.');
      }
    },
    async fetchDoctors() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const doctorAddresses = await contract.getOrganizationDoctors(this.account);
        this.doctors = await Promise.all(doctorAddresses.map(async address => {
          const name = await contract.doctors(address);
          return { name: name.name, address: address };
        }));
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert('Failed to fetch doctors. Check the console for errors.');
      }
    },
    async addDoctor() {
      if (!this.doctorAddress || !this.doctorName) {
        alert('Please provide organization address, doctor address, and doctor name.');
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contract.addDoctor(this.doctorAddress, this.doctorName);
        await tx.wait()
        alert('Doctor added successfully.');
        await this.fetchDoctors();
      } catch (error) {
        console.error('Error adding doctor:', error);
        alert('Failed to add doctor. Check the console for errors.');
      }
    },
    async removeDoctor(selected) {
      if (!selected) {
        alert('Please provide doctor address.');
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contract.removeDoctor(selected);
        await tx.wait()
        alert('Doctor removed successfully.');
        await this.fetchDoctors();
      } catch (error) {
        console.error('Error removing doctor:', error);
        alert('Failed to remove doctor. Check the console for errors.');
      }
    },
    async decryptUserData() {
      if (!this.userAddress || !this.privateKey) {
        alert('Please provide both user address and your private key.');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const userData = await contract.getUserDataByOrg(this.userAddress);
        const ipfsHash = userData.ipfsHash
        console.log(userData.publicKey)
        if (!ipfsHash || ipfsHash === '0x') {
          alert('No data found for this user.');
          return;
        }

        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        const response = await axios.get(url);
        const encryptedData = response.data;
        const decryptedData = await decryptData(encryptedData, window.atob(this.privateKey));
        this.userInfo = JSON.parse(decryptedData);
      } catch (error) {
        console.error('Error decrypting user data:', error);
        alert('Failed to decrypt data. Check the console for errors.');
      }
    }
  },
  created() {
    this.connectWallet();
  }
};
</script>
<style scoped>
@import url("@/assets/style.css");

</style>