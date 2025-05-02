<template>
    <div class="structure">
        <h1>Time Recorder</h1>
        <p style="font-size: 78px; padding: 5px; margin: 0; background-color: #737373; border-radius: 8px; display: flex; justify-content: center;">00:00</p>
        <div>
            <button>play</button>
            <button>stop</button>
        </div>
        <select name="registrable" id="registrable">
            <option value=""></option>
        </select>
    </div>
</template>
<script>
export default {
    name: 'TimeRecorder',
    data() {
        return {
            timeHours: 0,
            timeMinutes: 0,
            timeSeconds: 0,
            isRecording: false,
            selectedRegistrable: null,
        };
    },
}
</script>
<style scoped>
.structure {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: white;
    background-color: #2C2C2C;
    border-radius: 8px;
}
</style>