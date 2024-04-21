<template>
  <div>
    <input v-model="doctorAddress" placeholder="Doctor Ethereum Address" />
    <input v-model="doctorName" placeholder="Doctor Name" />
    <button @click="addDoctor">Add Doctor</button>

    <h2>Remove doctor</h2>
    <select v-model="selectedDoctor">
          <option v-for="doctor in doctors" :key="doctor.address" :value="doctor.address">
            {{ doctor.name }}
          </option>
    </select>
    <button @click="removeDoctor">Remove Doctor</button>

    <input v-model="userAddress" placeholder="User Ethereum Address" />
    <textarea v-model="privateKey" placeholder="Your Private Key" rows="4"></textarea>
    <button @click="decryptUserData">Decrypt User Data</button>
    <div v-if="userInfo">
      <h3>Decrypted Data:</h3>
      <p><strong>First Name:</strong> {{ userInfo.firstName }}</p>
      <p><strong>Last Name:</strong> {{ userInfo.lastName }}</p>
      <p><strong>Phone Number:</strong> {{ userInfo.phoneNumber }}</p>
      <p><strong>Email:</strong> {{ userInfo.email }}</p>
      <p><strong>Age:</strong> {{ userInfo.age }}</p>
      <p><strong>Medical History:</strong> {{ userInfo.medicalHistory }}</p>
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
    async removeDoctor() {
      if (!this.selectedDoctor) {
        alert('Please provide doctor address.');
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contract.removeDoctor(this.selectedDoctor);
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
  div {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  input, textarea, button {
    width: 100%;
    margin: 1rem 0;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  textarea {
    height: 100px;
  }
  
  button {
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #da190b;
  }
  
  @media (min-width: 480px) {
    input, textarea, button {
      width: 50%;
    }
  }
  </style>
  