<template>
    <div class="market-summary flex-row">
        <!-- <span class="favorite{% if request|has_favorite:market.id %} favored{% endif %}" id="{{market.id}}">
            {% include 'markets/corn_favorite_simple.svg' %}
        </span> -->

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

/* Title */
.market-summary .content-wrapper {
    padding-left: 10px;
    max-width: calc(100% - 40px);
}
.market-summary h3.market-name  {
    display: flex;
    margin-top: 0;
    margin-bottom: 0.5em;
}
.market-summary .market-name a {
    color: hsl(214, 86%, 55%);
    text-decoration: none;
    text-align: left;
    vertical-align: middle;
}
.market-summary .market-name a:focus,
.market-summary .market-name a:hover {
    color: hsl(215, 77%, 37%);
}

/* Non-title linked elements in market summary */
.market-summary a,
.flat-box a {
    margin: 0;
    color: inherit;
    text-decoration: none;
}
.market-summary a:hover,
.flat-box a:hover {
    color: #666;
}

.market-address {
    text-transform: capitalize;
    text-decoration: none;
}
</style>
