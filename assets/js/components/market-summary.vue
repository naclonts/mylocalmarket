<template>
    <div class="market-summary inline flex-row">
        <div class="content-wrapper">
            <h3 class="market-name"><a :href="market.url">{{market.name}}</a></h3>
            <div>
                <a class="market-address" :href="market.maps_link" target="_blank">
                    <p>{{ market.address_street }}</p>
                </a>

                <a v-if="market.website != null"
                :href="market.website" title="Visit Market Website" target="_blank"
                ><p>Website</p></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['market'],
    data: function () {
        return {}
    },
    beforeMount: function() {
        console.log(this.market);
    }
}


</script>
<style>


</style>
