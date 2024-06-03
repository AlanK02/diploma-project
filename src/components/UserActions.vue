<template>
  <div class="form">
    <h1 class="title" v-if="doctors.length > 0">Doctor Appointment System</h1>

    <div class="users" v-if="doctors.length > 0">
      <div class="users__item" v-for="doctor in doctors" :key="doctor.address">
        <div class="users__title">{{ doctor.name }}</div>
        <div class="users__btn">
          <div class="users__button norm" @click="approveDoctor(doctor.address)">
            Approve Doctor
          </div>
          <div class="users__button" @click="revokeDoctor(doctor.address)">
            Revoke Doctor Approve
          </div>
        </div>
      </div>

      <h2 class="title" style="margin-top: 50px;">Your Appointments</h2>
      <div class="info" style="margin-top: 0px;">
        <div class="info__data" v-show="true">
          <div class="info__input">
            <p>{{ decryptedData ? decryptedData.diagnosis : 'Diagnosis' }}</p>
            <label v-if="decryptedData">Diagnosis</label>
          </div>
          <div class="info__input">
            <p>{{ decryptedData ? decryptedData.prescription : 'Prescription' }}</p>
            <label v-if="decryptedData">Prescription</label>
          </div>
        </div>
        <div class="info__form" style="width: 400px">
          <div class="info__form-input" style="height: 100px">
            <textarea :class="{ 'input': privateKey }" id="privateKey" v-model="privateKey"></textarea>
            <label for="privateKey">User Private key</label>
          </div>
        </div>
      </div>
      <div class="users" style="width: 100%; margin-bottom: 50px">
        <div class="users__item" v-for="(appointment, index) in appointments" :key="appointment.date">
          <div class="users__title">Appointment on {{ new Date(Number(appointment.date * 1000n)).toLocaleString() }}
            with Doctor {{ appointment.doctor }}</div>
          <div class="users__button" @click="decryptAppointment(index)">Check</div>
        </div>
      </div>
    </div>

    <div class="empty" v-if="appointments.length <= 0 && doctors.length <= 0">
      <div class="empty__icon">
        <img src="@/assets/times-circle-solid.svg" alt="">
      </div>
      <div class="empty__title">
        Empty for now
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '@/components/config.js';
import axios from 'axios';
import { decryptData } from '@/components/encryption.js';

export default {
  data() {
    return {
      provider: null,
      contract: null,
      userAddress: '',
      userOrganization: null,
      doctors: [],
      appointments: [],
      decryptedData: null,
      privateKey: ''
    };
  },
  created() {
    this.connectWallet();
  },
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        this.userAddress = await signer.getAddress();
        console.log(`Connected account: ${this.userAddress}`);
        await this.loadDoctors();
        await this.loadAppointments();;
      } else {
        alert('Please install MetaMask.');
      }
    },
    async loadDoctors() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const orgAddress = await contract.getOrganizationAddress(this.userAddress);
      const doctorAddresses = await contract.getOrganizationDoctors(orgAddress);
      this.doctors = await Promise.all(doctorAddresses.map(async address => {
        const docInfo = await contract.doctors(address);
        return {
          name: docInfo.name,
          address: address,
        };
      }));
    },
    async approveDoctor(doctorAddress) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.approveDoctor(doctorAddress)
    },
    async revokeDoctor(doctorAddress) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.revokeDoctorApprove(doctorAddress)
    },
    async loadAppointments() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const appointmentsRaw = await contract.getUserAppointments();
      this.appointments = appointmentsRaw.map(appointment => ({
        doctor: appointment.doctor,
        date: appointment.date
      }));
    },
    async decryptAppointment(index) {
      if (!this.privateKey) {
        alert('Please provide your private key.');
        return;
      }

      if (index >= this.appointments.length || index < 0) {
        alert('Invalid appointment index.');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const appointment = await contract.getUserAppointment(index);
        const ipfsHash = appointment.ipfsHash;

        if (!ipfsHash || ipfsHash === '0x') {
          alert('No data found for this appointment.');
          return;
        }

        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        const response = await axios.get(url);
        const encryptedData = response.data;
        const decryptedData = await decryptData(encryptedData, window.atob(this.privateKey));
        this.decryptedData = JSON.parse(decryptedData);
      } catch (error) {
        console.error('Error decrypting appointment data:', error);
        alert('Failed to decrypt appointment. Check the console for errors.');
      }
    }
  }
};
</script>

<style scoped>
@import url("@/assets/style.css");
</style>