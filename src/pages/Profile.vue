<template>
  <div style="margin-top: 180px;">
    <div class="profile-container">
      <h1>Your account details</h1>  
      <div class="profile-row">
        <div class="profile-item">
          <label for="Name">Name</label>
          <input type="text" name="Name" id="Name" v-model="name">
        </div>
        <div class="profile-item">
          <label for="Email">Email</label>
          <input type="email" name="Email" id="Email" v-model="email">
        </div>
      </div>
      <div class="profile-row">
        <div class="profile-item">
          <label for="Password">Password</label>
          <input type="password" name="Password" id="Password" v-model="password">
        </div>
        <div class="profile-item">
          <label for="ConfirmPassword">Confirm Password</label>
          <input type="password" name="ConfirmPassword" id="ConfirmPassword" v-model="confirmPassword">
        </div>
      </div>

      <p v-if="!this.isPasswordLongEnough && this.userWantsChangePassword">Password must be at least 8 characters long</p>
      <p v-if="!this.isPasswordMatching && this.userWantsChangePassword">Passwords do not match</p>

      <div style="display: flex; justify-content: flex-end; align-content: center; gap: 10px;">
        <p v-if="savedSuccessfully" style="padding: 10px 20px;margin: 0; color: white; font-weight: bold; background-color: #009951; border-radius: 8px;">Your profile has been saved!</p>
        <button style="background-color: #5438DC; color: white; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px;" :disabled="this.userWantsChangePassword && (!this.isPasswordLongEnough || !this.isPasswordMatching)" @click="updateAccount">Update</button>
      </div>
    </div>
    <button @click="confirmationForDelete = true" style="background-color: #FF4F4D; color: white; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px; justify-content: center; align-items: center; display: flex; gap: 10px; margin: 10px auto;">Delete your account <img src="../assets/trash.svg" alt="Trash" style="height: 22px;"></button>
    <ConfirmationModal v-if="confirmationForDelete" @yes="deleteAccount" @no="confirmationForDelete = false" />
  </div>
</template>

<script>
import { deleteAccount, updateUser, getUser } from '../api/auth';
import { useUserStore } from '../stores/user';
import ConfirmationModal from '../components/ConfirmationModal.vue';
export default {
  name: 'Profile',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      confirmationForDelete: false,
      savedSuccessfully: false,
    };
  },
  components: {
    ConfirmationModal
  },
  async mounted() {
    const userStore = useUserStore();
    if (!userStore.user) {
      await getUser()
        .then(response => {
          userStore.setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }

    this.name = userStore.user.name;
    this.email = userStore.user.email;
  },
  computed: {
    isPasswordLongEnough() {
      return this.password.length >= 8;
    },
    isPasswordMatching() {
      return this.password === this.confirmPassword;
    },
    userWantsChangePassword() {
      return this.password.length > 0 || this.confirmPassword.length > 0;
    }
  },
  methods: {
    async deleteAccount() {
      const userStore = useUserStore();
      try {
        await deleteAccount();
        this.$router.push('/login');
        userStore.logout();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    },
    async updateAccount() {
      const userStore = useUserStore();
      try {
        await updateUser({
          name: this.name,
          email: this.email,
          password: (this.isPasswordLongEnough && this.isPasswordMatching) ? this.password : null,
          password_confirmation: (this.isPasswordLongEnough && this.isPasswordMatching) ? this.confirmPassword : null,
        });

        userStore.setUser({
          ...userStore.user,
          name: this.name,
          email: this.email,
        });

        this.savedSuccessfully = true;
      } catch (error) {
        console.error('Error updating account:', error);
      }
    }
  },
}
</script>

<style scoped>
.profile-container {
    background-color: #D9D9D9;
    border-radius: 16px;
    padding: 20px;
    width: 50%;
    margin: 0 auto;
}

.profile-container label {
    font-weight: bold;
}

.profile-container input {
    border-radius: 4px;
    border: none;
    padding: 10px;
    width: 100%;
}

.profile-row {
    display: flex;
    flex-direction: row;
    gap: 40px;
    margin-bottom: 20px;
    justify-content: center;
}

.profile-item {
    display: flex;
    flex-direction: column;
}
</style>