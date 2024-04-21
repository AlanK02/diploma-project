<template>
    <div>
      <h2>Manage Medical Organizations</h2>
      <div>
        <h3>Pending Approvals</h3>
        <ul>
          <li v-for="orgAddress in pendingOrgAddresses" :key="orgAddress + 'pending'">
            {{ orgAddress }}
            <button @click="approveOrganization(orgAddress)">Approve</button>
          </li>
        </ul>
      </div>
      <div>
        <h3>Registered Organizations</h3>
        <ul>
          <li v-for="orgAddress in registeredOrgAddresses" :key="orgAddress + 'registered'">
            {{ orgAddress }}
            <button @click="revokeRegistration(orgAddress)">Revoke</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ethers } from 'ethers';
  import { contractABI, contractAddress } from '@/components/config.js';
  
  export default {
    data() {
      return {
        pendingOrgAddresses: [],
        registeredOrgAddresses: [],
      };
    },
    methods: {
      async loadOrganizations() {
        if (typeof window.ethereum === 'undefined') {
          alert('Please install MetaMask to continue.');
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        this.pendingOrgAddresses = await contract.getPendingOrganizations();
        this.registeredOrgAddresses = await contract.getRegisteredOrganizations();
      },
      async approveOrganization(orgAddress) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          const transaction = await contract.approveRegistration(orgAddress);
          await transaction.wait();
          alert(`Organization ${orgAddress} approved.`);
          await this.loadOrganizations();
        } catch (error) {
          console.error('Approval failed:', error);
          alert('Failed to approve organization. See console for details.');
        }
      },
      async revokeRegistration(orgAddress) {
        try {
         const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          const transaction = await contract.revokeRegistration(orgAddress);
          await transaction.wait();
          alert(`Registration for ${orgAddress} revoked.`);
          await this.loadOrganizations();
        } catch (error) {
          console.error('Revocation failed:', error);
          alert('Failed to revoke organization registration. See console for details.');
        }
      },
    },
    mounted() {
      this.loadOrganizations();
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
  
  h2, h3 {
    color: #333;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  button {
    background-color: #008CBA;
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #007ba7;
  }
  
  @media (min-width: 480px) {
    ul {
      width: 50%;
    }
  }
  </style>
  