<template>
  <div class="form">
    <h1 class="title">Doctor System</h1>
    <div class="form__row">
      <div class="form__input">
        <input id="diagnosis" v-model="diagnosis" :class="{ 'input': diagnosis }" />
        <label for="diagnosis">Diagnosis</label>
      </div>
      <div class="form__input">
        <input id="prescription" v-model="prescription" :class="{ 'input': prescription }" />
        <label for="prescription">Prescription</label>
      </div>
      <div class="form__input">
        <input id="userAddress" v-model="userAddress" :class="{ 'input': userAddress }" />
        <label for="userAddress">User Address</label>
      </div>
      <button @click="encryptAndStoreData">
        Send appointment to user
      </button>
    </div>
    <h2 class="subtitle" style="margin-top: 50px;">Your Appointments</h2>
    <div class="users" style="width: 100%;">
      <div class="users__item" v-for="appointment in appointments" :key="appointment.date">
        <div class="users__title">Appointment on {{ new Date(Number(appointment.date * 1000n)).toLocaleString() }}
          with User {{ appointment.patient }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { encryptData } from '@/components/encryption.js';
import { contractABI, contractAddress, JWT } from '@/components/config.js';
import axios from 'axios';

export default {
  data() {
    return {
      diagnosis: '',
      prescription: '',
      userAddress: '',
      doctors: [],
      appointments: [],
      JWT: JWT
    };
  },
  created() {
    this.loadAppointments();
  },
  methods: {
    async addAppointment() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      await contract.addAppointment(this.userAddress)
    },
    async loadAppointments() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const appointmentsRaw = await contract.getDoctorAppoinments();
      this.appointments = appointmentsRaw.map(appointment => ({
        date: appointment.date,
        patient: appointment.patient
      }));
    },
    async encryptAndStoreData() {
      if (!this.diagnosis || !this.prescription) {
        alert('Please both diagnosis and prescription');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const userData = await contract.getUserDataByDoctor(this.userAddress)
      const dataToEncrypt = {
        diagnosis: this.diagnosis,
        prescription: this.prescription
      };
      const encryptedData = await encryptData(JSON.stringify(dataToEncrypt), window.atob(userData.publicKey));

      const formData = new FormData();
      formData.append('file', new Blob([JSON.stringify(encryptedData)], { type: 'application/json' }));

      try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${this.JWT}`
          }
        });

        const path = response.data.IpfsHash;
        console.log(path)
        const transaction = await contract.addAppointment(this.userAddress, path);
        await transaction.wait();
        alert('Data successfully encrypted and stored on IPFS.');
        await this.loadAppointments()
      } catch (error) {
        console.error('Encryption or IPFS upload failed', error);
        alert('Failed to encrypt or upload data. See console for details.');
      }
    }
  }
};
</script>

<style scoped>
@import url("@/assets/style.css");
</style>