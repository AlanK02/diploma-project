<template>
  <div class="form">
    <div class="form__row">
      <div class="form__btn">
        <button @click="connectWallet">Connect Wallet</button>
        <button @click="generateKeys">Generate Keys</button>
      </div>
      <div class="form__input big">
        <textarea id="publicKey" :class="{ 'input': publicKey }" v-model="publicKey" readonly></textarea>
        <label for="publicKey">Public Key:</label>
      </div>
      <div class="form__input big">
        <textarea id="privateKey" :class="{ 'input': privateKey }" v-model="privateKey" readonly></textarea>
        <label for="privateKey">Private Key:</label>
      </div>
      <div class="form__input">
        <input id="firstName" :class="{ 'input': userInfo.firstName }" v-model="userInfo.firstName" />
        <label for="firstName">First Name</label>
      </div>
      <div class="form__input">
        <input id="lastName" :class="{ 'input': userInfo.lastName }" v-model="userInfo.lastName" />
        <label for="lastName">Last Name</label>
      </div>
      <div class="form__input" :class="{ 'error': errors.includes('Invalid phone number.')}">
        <input id="userInfo.phoneNumber" :class="{ 'input': userInfo.phoneNumber }"
          v-model="userInfo.phoneNumber"></input>
        <label for="userInfo.phoneNumber">Phone Number</label>
        <div class="form__error">Invalid phone number</div>
      </div>
      <div class="form__input" :class="{ 'error': errors.includes('Invalid email address.')}">
        <input id="userInfo.email" :class="{ 'input': userInfo.email }" v-model="userInfo.email" />
        <label for="userInfo.email">Email</label>
        <div class="form__error">Invalid email address</div>
      </div>
      <div class="form__input" :class="{ 'error': errors.includes('Invalid age. Please enter a value between 0 and 120.')}">
        <input id="userInfo.age" :class="{ 'input': userInfo.age }" v-model="userInfo.age" />
        <label for="userInfo.age">Age</label>
        <div class="form__error">Invalid age. Please enter a value between 0 and 120</div>
      </div>
      <div class="form__input">
        <select v-model="selectedOrganization">
          <option v-for="(medicalEntity, index) in medicalEntities" :selected="index === 0" :key="medicalEntity.address" :value="medicalEntity.address">
            {{ medicalEntity.name }}
          </option>
        </select>
      </div>
      <div class="form__input big">
        <textarea id="userInfo.medicalHistory" :class="{ 'input': userInfo.medicalHistory }"
          v-model="userInfo.medicalHistory"></textarea>
        <label for="userInfo.medicalHistory">Medical History</label>
      </div>
      <button @click="submitInformation">Submit Information</button>
    </div>
  </div>
</template>



<script>
import * as openpgp from 'openpgp';
import { ethers } from 'ethers';
import { encryptData } from '@/components/encryption.js';
import { contractABI, contractAddress, JWT } from '@/components/config.js';
import axios from 'axios';


export default {
  data() {
    return {
      publicKey: '',
      privateKey: '',
      account: null,
      medicalEntities: [],
      selectedOrganization: '',
      JWT: JWT,
      userInfo: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        age: '',
        medicalHistory: ''
      },
      errors: []
    };
  },
  methods: {
    validatePhone() {
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
      if (!this.userInfo.phoneNumber.match(phoneRegex)) {
        this.errors.push('Invalid phone number.');
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.userInfo.email.match(emailRegex)) {
        this.errors.push('Invalid email address.');
      }
    },
    validateAge() {
      if (this.userInfo.age < 0 || this.userInfo.age > 120) {
        this.errors.push('Invalid age. Please enter a value between 0 and 120.');
      }
    },
    async submitInformation() {
      this.errors = [];
      this.validatePhone();
      this.validateEmail();
      this.validateAge();
      if (this.errors.length === 0) {
        await this.encryptAndStoreData()
      }
    },
    async getProvider() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider;
    },
    async getSigner() {
      const provider = await this.getProvider();
      const signer = await provider.getSigner();
      return signer;
    },
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
    async connectWallet() {
      if (window.ethereum) {
        const signer = await this.getSigner();
        this.account = await signer.getAddress();
        console.log(`Connected account: ${this.account}`);
        await this.loadMedicalEntities();
      } else {
        alert('Please install MetaMask.');
      }
    },
    async loadMedicalEntities() {
      const provider = await this.getProvider();
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const orgAddresses = await contract.getRegisteredOrganizations();

      this.medicalEntities = await Promise.all(orgAddresses.map(async (address) => {
        const details = await contract.getOrganizationDetails(address);
        return {
          address,
          publicKey: details.publicKey,
          name: `${details.name} (${address.substring(0, 6)}...)`
        };
      }));

    },
    async encryptAndStoreData() {
      const selectedEntity = this.medicalEntities.find(entity => entity.address === this.selectedOrganization);
      if (!selectedEntity) return alert('Select a valid medical entity');
      const encryptedData = await encryptData(JSON.stringify(this.userInfo), window.atob(selectedEntity.publicKey));

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
        const signer = await this.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const transaction = await contract.storeUserData(path, selectedEntity.address, this.publicKey);
        await transaction.wait();
        alert('Data successfully encrypted and stored on IPFS.');
      } catch (error) {
        console.error('Encryption or IPFS upload failed', error);
        alert('Failed to encrypt or upload data. See console for details.');
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
