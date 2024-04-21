<template>
    <div class="appointment-system">
      <h1>Doctor Appointment System</h1>
      <div v-if="doctors.length > 0">
        <h2>Available Doctors</h2>
        <ul>
          <li v-for="doctor in doctors" :key="doctor.address">
            {{ doctor.name }}
                <button @click="approveDoctor(doctor.address)">
                  Approve Doctor
                </button>
                <button @click="revokeDoctor(doctor.address)">
                  Revoke Doctor Approve
                </button>
          </li>
        </ul>
      </div>
    <div v-if="appointments.length > 0">
      <h2>Get appointment</h2>
      <textarea v-model="privateKey" placeholder="Your Private Key" rows="4"></textarea>
      <div v-if="decryptedData">
        <h3>Decrypted Data:</h3>
        <p>Diagnosis: {{ decryptedData.diagnosis }}</p>
        <p>Prescription: {{ decryptedData.prescription }}</p>
      </div>
    <h2>Your Appointments</h2>
    <ul>
        <li v-for="(appointment, index) in appointments" :key="appointment.date">
          Appointment on {{ new Date(Number(appointment.date * 1000n)).toLocaleString() }}
            with Doctor {{ appointment.doctor }}
            <button @click="decryptAppointment(index)">
                Check appointment
            </button>          
        </li>
    </ul>
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
  .appointment-system {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  button {
    margin-top: 5px;
  }
  </style>
  