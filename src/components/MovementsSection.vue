<template>
    <div>
        <h3>{{ name }}</h3>
    </div>
</template>
<script>
export default {
    name: 'MovementsSection',
    props: {
        name: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            movements: []
        }
    },
    methods: {
    }
}
</script>
<style>
    
</style>