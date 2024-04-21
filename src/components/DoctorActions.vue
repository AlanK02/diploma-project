<template>
    <div class="appointment-system">
      <h1>Doctor System</h1>
      <input v-model="diagnosis" placeholder="Diagnosis" />
      <input v-model="prescription" placeholder="Prescription" />
      <input v-model="userAddress" placeholder="User address" />
        <button @click="encryptAndStoreData">
                  Send appointment to user
        </button>
      </div>
      <div v-if="appointments.length > 0">
        <h2>Your Appointments</h2>
        <ul>
          <li v-for="appointment in appointments" :key="appointment.date">
            Appointment on {{ new Date(Number(appointment.date * 1000n)).toLocaleString() }}
            with User {{  appointment.patient }}
          </li>
        </ul>
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
  .appointment-system {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  button {
    margin-top: 5px;
  }
  </style>
  