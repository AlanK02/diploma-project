<template>
    <div>
      <button @click="generateKeys">Generate Keys</button>
      <div v-if="publicKey">
        <p>Medicine Company Name:</p>
        <input v-model="medicalEntityName" placeholder="Medical Entity Name" />
        <p>Public Key:</p>
        <textarea v-model="publicKey" readonly rows="4"></textarea>
        <p>Private Key:</p>
        <textarea v-model="privateKey" readonly rows="4"></textarea>
        <button @click="requestRegistration">Request Registration</button>
      </div>
    </div>
  </template>
  
  <script>
  import * as openpgp from 'openpgp';
  import { ethers } from 'ethers';
  import { contractABI, contractAddress, JWT } from '@/components/config.js';

  export default {
    data() {
      return {
        publicKey: '',
        privateKey: '',
        medicalEntityName: '',
      };
    },
    methods: {
      async generateKeys() {

        try {
          const primaryKeyPair  = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: { name: 'Medical Organization', email: 'medorg@example.com' },
          });
          this.privateKey = window.btoa(primaryKeyPair.privateKey);
          this.publicKey = window.btoa(primaryKeyPair.publicKey);
        } catch (error) {
          console.error('Error generating keys:', error);
        }
      },
      async requestRegistration() {
        if (!this.publicKey) return alert('Public key is not generated.');
  
        try {
          if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const transaction = await contract.requestRegistration(this.medicalEntityName, this.publicKey);
            await transaction.wait();
  
            alert('Registration request sent successfully.');
          } else {
            alert('Ethereum wallet is not connected.');
          }
        } catch (error) {
          console.error('Error requesting registration:', error);
        }
      },
    },
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
    background-color: #2196F3;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0b7dda;
  }
  
  @media (min-width: 480px) {
    input, textarea, button {
      width: 50%;
    }
  }
  </style>