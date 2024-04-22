export let contractAddress = '0x5A800E78E13BD38D866D6E58A403CFA945C7d866'
export let contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"doctor","type":"address"},{"indexed":false,"internalType":"address","name":"organizationAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"AppointmentAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"ipfsHash","type":"string"},{"indexed":false,"internalType":"address","name":"organizationAddress","type":"address"}],"name":"DataStored","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"orgAddress","type":"address"},{"indexed":false,"internalType":"address","name":"doctorAddress","type":"address"}],"name":"DoctorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"orgAddress","type":"address"},{"indexed":false,"internalType":"address","name":"doctorAddress","type":"address"}],"name":"DoctorRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"orgAddress","type":"address"},{"indexed":false,"internalType":"string","name":"publicKey","type":"string"}],"name":"MedicalOrganizationPublicKeyUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"orgAddress","type":"address"}],"name":"MedicalOrganizationRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"orgAddress","type":"address"}],"name":"MedicalOrganizationRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"orgAddress","type":"address"}],"name":"OrganizationRegistrationRequested","type":"event"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"addAppointment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"doctorAddress","type":"address"},{"internalType":"string","name":"doctorName","type":"string"}],"name":"addDoctor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"doctor","type":"address"}],"name":"approveDoctor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"orgAddress","type":"address"}],"name":"approveRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newadmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"doctors","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDoctorAppoinments","outputs":[{"components":[{"internalType":"address","name":"doctor","type":"address"},{"internalType":"address","name":"patient","type":"address"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"}],"internalType":"struct MedicalDataStorage.Appointment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getOrganizationAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"orgAddress","type":"address"}],"name":"getOrganizationDetails","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"publicKey","type":"string"},{"internalType":"bool","name":"isRegistered","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"orgAddress","type":"address"}],"name":"getOrganizationDoctors","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"orgAddress","type":"address"}],"name":"getOrganizationPublicKey","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPendingOrganizations","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRegisteredOrganizations","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserAppointment","outputs":[{"components":[{"internalType":"address","name":"doctor","type":"address"},{"internalType":"address","name":"patient","type":"address"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"}],"internalType":"struct MedicalDataStorage.Appointment","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserAppointments","outputs":[{"components":[{"internalType":"address","name":"doctor","type":"address"},{"internalType":"address","name":"patient","type":"address"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"}],"internalType":"struct MedicalDataStorage.Appointment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserDataByDoctor","outputs":[{"components":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"},{"internalType":"string","name":"publicKey","type":"string"}],"internalType":"struct MedicalDataStorage.UserData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserDataByOrg","outputs":[{"components":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"},{"internalType":"string","name":"publicKey","type":"string"}],"internalType":"struct MedicalDataStorage.UserData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"medicalOrganizations","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"publicKey","type":"string"},{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"bool","name":"isPending","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"organizationDoctors","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingOrganizationAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"registeredOrganizationAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"doctorAddress","type":"address"}],"name":"removeDoctor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"publicKey","type":"string"}],"name":"requestRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"doctor","type":"address"}],"name":"revokeDoctorApprove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"orgAddress","type":"address"}],"name":"revokeRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"organizationAddress","type":"address"},{"internalType":"string","name":"publicKey","type":"string"}],"name":"storeUserData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"publicKey","type":"string"}],"name":"updatePublicKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"publicKey","type":"string"}],"name":"updateUserPublicKey","outputs":[],"stateMutability":"nonpayable","type":"function"}]
export let JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNjZjMGE5ZC0wZTBmLTQ1YjktODYyOC04YTk1NDA5NWI5Y2QiLCJlbWFpbCI6ImFsYW5zdW4yMDAyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjYjAzOGMwYjNmZGUxYTdjZmVkYyIsInNjb3BlZEtleVNlY3JldCI6IjczZjgxOWRkNjViZGM4MTljZjhkM2ZjZTUyZmJjOGEwOTE1NjAxMWFmMzEwOGEwYWI2MzAwMmNmMDgwNDdkNjciLCJpYXQiOjE3MTI4MzMyODh9.rqBCKej9yLPDczXn4nqTPB1LGtII6e6_4ueNKmIiyhw'
