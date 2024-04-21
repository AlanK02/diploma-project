<template>
    <div>
      <button @click="connectWallet">Connect Wallet</button>
      <div>
      <button @click="generateKeys">Generate Keys</button>
      <div v-if="publicKey">
        <p>Public Key:</p>
        <textarea v-model="publicKey" readonly rows="4"></textarea>
        <p>Private Key:</p>
        <textarea v-model="privateKey" readonly rows="4"></textarea>
      </div>
    </div>
      <div v-if="publicKey">
        <div>
      <input v-model="userInfo.firstName" placeholder="First Name" />
      <input v-model="userInfo.lastName" placeholder="Last Name" />
      <input v-model="userInfo.phoneNumber" placeholder="Phone Number" @blur="validatePhone" />
      <input v-model="userInfo.email" placeholder="Email Address" @blur="validateEmail" />
      <input v-model="userInfo.age" type="number" placeholder="Age" @blur="validateAge" />
      <textarea v-model="userInfo.medicalHistory" placeholder="Previous Diseases, Diagnoses, and Treatments"></textarea>
      <button @click="submitInformation">Submit Information</button>
      <div v-if="errors.length">
        <p><b>Please correct the following error(s):</b></p>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </div>
        <select v-model="selectedOrganization">
          <option v-for="medicalEntity in medicalEntities" :key="medicalEntity.address" :value="medicalEntity.address">
            {{ medicalEntity.name }}
          </option>
        </select>
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
div {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input, select, button {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

@media (min-width: 480px) {
  input, select, button {
    width: 50%;
  }
}
</style>

