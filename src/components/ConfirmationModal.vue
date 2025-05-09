<template>
    <div class="confirmation-overlay">
        <div class="confirmation-modal">
            <h2>Do you confirm this action?</h2>
            <div style="display: flex; flex-direction: row; gap: 20px;">
                <button style="background-color: #009951;" @click="$emit('yes')">Yes</button>
                <button style="background-color: #FF4F4D;" @click="$emit('no')">No</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfirmationModal',
}
</script>

<style scoped>
    .confirmation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .confirmation-modal {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }
    .confirmation-modal h2 {
        margin: 0;
        font-size: 24px;
        text-align: center;
    }
    .confirmation-modal button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    }
</style>
