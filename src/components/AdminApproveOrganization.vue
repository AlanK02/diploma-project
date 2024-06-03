<template>
  <div class="form">
    <h2 class="title" v-if="registeredOrgAddresses.length > 0 && pendingOrgAddresses.length > 0">Manage Medical Organizations</h2>
    <h3 class="subtitle" v-if="pendingOrgAddresses.length > 0">Pending Approvals</h3>
    <div class="users">
      <div class="users__item" v-for="orgAddress in pendingOrgAddresses" :key="orgAddress + 'pending'">
        <div class="users__title">{{ orgAddress }}</div>
        <div class="users__btn">
          <div class="users__button norm" @click="approveOrganization(orgAddress)">
            Approve Organization
          </div>
        </div>
      </div>
    </div>
    <h3 class="subtitle" style="margin-top: 50px;" v-if="registeredOrgAddresses.length > 0">Registered Organizations</h3>
    <div class="users">
      <div class="users__item" v-for="orgAddress in registeredOrgAddresses" :key="orgAddress + 'registered'">
        <div class="users__title">{{ orgAddress }}</div>
        <div class="users__btn">
          <div class="users__button" @click="revokeRegistration(orgAddress)">
            Revoke Organization
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-if="registeredOrgAddresses.length <= 0 && pendingOrgAddresses.length <= 0">
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
@import url("@/assets/style.css");
</style>