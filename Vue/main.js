var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium:{
            type: Boolean,
            required:true
        }
    },
    template:`
    <div class="product">
    <div class="product-image">
      <a :href="link">
        <img :src="image" alt="" />
      </a>
    </div>
  
    <!-- <div class="product-info">
      <h1>{{ product }}</h1>
      <p v-if="inventory > 10">In Stock</p>
      <p v-else-if="inventory <= 10 && inventory> 0">Almost Sold Out</p>
      <p v-else>Out of Stock</p>
       <p>{{ description }}</p>
    </div> -->
  
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p>Shipping {{ shipping }}</p>
  
      <!-- V-Show toggles and adds a display none -->
      <!-- <p v-show="inStock">In Stock</p>
        <p v-show="sale">On Sale!</p> -->
  
      <!-- Coding Challenge 6-->
      <p v-if="inStock">In Stock</p>
      <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
  
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
  
      <!-- <ul>
            <li v-for="size in sizes">{{ size }}</li>
        </ul> -->
  
        <div v-for="(variant, index) in variants" 
            :key="variant.variantID" class="color-box"
            :style="{ backgroundColor: variant.variantColor }" 
            @mouseover="updateProduct(index)">
        </div>
      <button v-on:click="addToCart" 
              :disabled="!inStock" 
              :class="{ disabledButton: !inStock }">
        Add to Cart
      </button>
      <!-- <button @click="decreaseCart">Remove from Cart</button> -->
    </div>
  
    <product-tabs :reviews="reviews"></product-tabs>

  </div>   
    `,
        data(){
            return{
                
                    brand: 'Vue Mastery',
                    product: 'Socks',
                    description: 'These are soft',
                    selectedVariant: 0,
                    link: 'https://vuejs.org/v2/guide/index.html',
                    sale: false,
                    details: ["80% cotton", "20% polyester", "Gender-Neutral"],
                    variants: [
                        {
                            variantID:2234,
                            variantColor: "green",
                            variantImage: "vmSocks-green-onWhite.jpg",
                            variantQuantity: 10,
                            variantSale: true
                        },
                        {
                            variantID: 2235,
                            variantColor: "blue",
                            variantImage: "vmSocks-blue-onWhite.jpg",
                            variantQuantity: 0,
                            variantSale: false
                        }
                    ],
                    reviews:[]
                    
                
            }
        },
        methods: {
            addToCart(){
                // this.cart += 1
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
            },
        
            updateProduct(index){
                this.selectedVariant = index
        }
            // ,
            // addReview(productReview){
            //     this.reviews.push(productReview)

            // }
        },
        computed:{
            title(){
                return this.brand + ' ' + this.product
            },
            image(){
                return this.variants[this.selectedVariant].variantImage
            },
            inStock(){
                return this.variants[this.selectedVariant].variantQuantity
            },
            shipping(){
                if(this.premium){
                    return "Free"
                }
                return 2.99
            }
        },
        mounted(){
            eventBus.$on('review-submitted', productReview =>{
                this.reviews.push(productReview)
            })
        }
})

Vue.component('product-review',{
    template:`
        <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s);</b>
            <ul>
            <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
        <label for="review">Review:</label>      
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
            
        <p>
        <input type="submit" value="Submit">  
        </p>    
    
    </form>
    `,
    data(){
        return{
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            if(this.name && this.rating && this.review){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }else{
                if(!this.name) this.errors.push("Name required")
                if(!this.rating) this.errors.push("Rating required")
                if(!this.review) this.errors.push("Review required")
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
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab">
                {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are now reviews yet.</p>
                
                <ul v-else>
                    <li v-for="(review, index) in reviews"
                        :key="index">
                        <p>{{ review.name }}</p>
                        <p>{{ review.rating }}</p>
                        <p>{{ review.review }}</p>     
                    </li>
                </ul>
            </div>

            <div>
                <product-review  v-show="selectedTab === 'Make a Review'"
               ></product-review>  
            </div>

        </div>
 
    `,
    data(){
        return{
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        premium:false,
        cart:[]    
    },
    methods:{
        updateCart(id){
            this.cart.push(id)
        }
    }
})
