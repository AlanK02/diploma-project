<template>
  <div class="form">
    <div class="form__row">
      <div class="form__input">
        <input :class="{ 'input': medicalEntityName }" id="medicine-company" v-model="medicalEntityName" />
        <label for="medicine-company">Medicine Company Name</label>
      </div>
      <div class="form__input big">
        <textarea :class="{ 'input': publicKey }" v-model="publicKey" readonly id="medicine-public" ></textarea>
        <label for="medicine-public">Public Key</label>
      </div>
      <div class="form__input big">
        <textarea :class="{ 'input': privateKey }" id="medicine-private" v-model="privateKey" readonly ></textarea>
        <label for="medicine-company">Private Key</label>
      </div>
      <div class="form__btn">
        <button @click="requestRegistration">Request Registration</button>
        <button @click="generateKeys">Generate Keys</button>
      </div>
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
        const primaryKeyPair = await openpgp.generateKey({
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
@import url("@/assets/style.css");
</style>