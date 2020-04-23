var app = new Vue({
    el: '#root',
    data: {
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
                varianstId: 101,
                variantColor: "green",
                variantImage: './pic/vmSocks-green.jpg',
                variantQuantity: 10
            },
            {
                varianstId: 102,
                variantColor: "blue",
                variantImage: './pic/vmSocks-blue.jpg',
                variantQuantity: 0
            }
        ],
        cart: 0,
        onSale: true
    },

    methods: {
        // addToCart(){
        addToCart: function(){
            this.cart += 1
        },
        // outFromCart: function(){
        //     this.cart -= 1
        // },
        updateProduct(index){
            this.selectedVariant = index
            console.log(index)
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
        }
    }
}) 