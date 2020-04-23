var eventBus = new Vue()

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        `
    
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
        
            <!-- binding -->
            <div class="product-image">
                <img v-bind:src="image">
                <a :href="link">Learn VueJs</a>
            </div>

            <!-- conditional rendering -->
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>{{ sale }}</p>
                <p>Shipping: {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <div v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <button @click="addToCart" 
                :disabled="!inStock"
                :class="{disabledButton: !inStock}" >Add to Cart</button>
                
                <button @click="removeFromCart">Remove from Cart</button>

                <br><br>
                <h2>Reviews</h2>
                <product-tabs :reviews="reviews"></product-tabs>
                
                
            </div>
        </div>
    `,
    data: function() {
        return {
            brand: 'Lenovo',
            product: 'Socks',
            // image: './pic/vmSocks-green.jpg',
            selectedVariant: 0,
            link: 'https://vuejs.org/v2/guide/',
            // inStock: true,
            // inventory: 80,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 101,
                    variantColor: "green",
                    variantImage: './pic/vmSocks-green.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 102,
                    variantColor: "blue",
                    variantImage: './pic/vmSocks-blue.jpg',
                    variantQuantity: 0
                }
            ],
            onSale: true,
            reviews: []
        }
    },

    methods: {
        // addToCart(){
        addToCart: function(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        // outFromCart: function(){
        //     this.cart -= 1
        // },
        updateProduct(index){
            this.selectedVariant = index
            console.log(index)
        },
        removeFromCart: function(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        }
    },
    computed: {
        title(){
            return this.brand + " " + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            if(this.onSale){
                return this.brand + ' ' + this.product + 'are on sale!'
            }
            return this.brand + ' ' + this.product + 'are not on sale!'
        },
        shipping(){
            if(this.premium){
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
          this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p class="error" v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>

    <p>
        <label for="name">Name</label>
        <input id="name" v-model="name">
    </p>

    <p>
        <label for="review">Review</label>
        <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>

    <p>Would you recommend this product?</p>
    <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
    </label>

    <p>
        <input type="submit" value="Submit">
    </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit(){
            if(this.name && this.review && this.rating && this.recommend){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab">
                {{ tab }}</span>

                
                <div v-show="selectedTab === 'Reviews'">
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul v-else>
                        <li v-for="(review, index) in reviews" :key="index">
                            <p>{{ review.name }}</p>
                            <p>{{ review.review }}</p>
                            <p>Rating: {{ review.rating }}</p>
                            <p>Recommend: {{ review.recommend }}</p>
                        </li>
                    </ul>
                </div>
                <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
        data(){
            return {
                tabs: ['Reviews', 'Make a Review'],
                selectedTab: 'Reviews'
            }
        }
})

var app = new Vue({
    el: '#root',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id){
            this.cart.push(id)
        },
        removeItem(id){
            for(var i = this.cart.length - 1; i>=0; i--) {
                if(this.cart[i] === id){
                    this.cart.splice(i,1)
                }
            }
        }
    }
}) 