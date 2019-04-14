<template>
    <div class="event">
        <span>{{event.user_id}}</span><br>
        <span>{{event.title}}</span><br>
        <span>{{event.start}} - {{event.end}}</span>
    </div>
</template>

<script>
export default {
    props: ["event"]
}
</script>

<style lang="scss" scoped>
.event {
    background-color: black;
    border-radius: 10px;
    color: white;
    margin-bottom: 10px;
    padding: 10px;
}
</style>


