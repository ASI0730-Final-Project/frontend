<template>
  <div class="pricing-container">
    <div class="pricing-card">
      <form @submit.prevent="handleSubmit" role="form" aria-labelledby="calculator-title">
        <h3 id="calculator-title">Price Calculator</h3>
        <p class="description" id="calculator-desc">Specify the Range, and we will establish a base price.</p>

        <div class="form-group horizontal-item">
          <label for="days-delivery">Days Delivery</label>
          <select
            id="days-delivery"
            v-model="pricing.daysDelivery"
            aria-required="true"
            aria-describedby="days-desc"
          >
            <option value="" disabled selected>Choose (4 - 8)</option>
            <option value="4">4 Days</option>
            <option value="5">5 Days</option>
            <option value="6">6 Days</option>
            <option value="7">7 Days</option>
            <option value="8">8 Days</option>
          </select>
          <small id="days-desc" class="sr-only">Select delivery time in days</small>
        </div>

        <div class="form-group horizontal-item">
          <label for="responsive">Responsive</label>
          <select
            id="responsive"
            v-model="pricing.responsive"
            aria-required="true"
            aria-describedby="responsive-desc"
          >
            <option value="" disabled selected>Choose (yes/no)</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <small id="responsive-desc" class="sr-only">Choose if the site should be responsive</small>
        </div>

        <div class="form-group horizontal-item">
          <label for="revisions">Revisions</label>
          <select
            id="revisions"
            v-model="pricing.revisions"
            aria-required="true"
            aria-describedby="revisions-desc"
          >
            <option value="" disabled selected>Choose (0 - 3)</option>
            <option value="0">0 Revisions</option>
            <option value="1">1 Revision</option>
            <option value="2">2 Revisions</option>
            <option value="3">3 Revisions</option>
          </select>
          <small id="revisions-desc" class="sr-only">Select how many revisions are allowed</small>
        </div>

        <div class="form-group horizontal-item">
          <label for="pages">Pages</label>
          <select
            id="pages"
            v-model="pricing.pages"
            aria-required="true"
            aria-describedby="pages-desc"
          >
            <option value="" disabled selected>Choose (1 - 15)</option>
            <option v-for="n in 15" :key="n" :value="n">{{ n }} Pages</option>
          </select>
          <small id="pages-desc" class="sr-only">Number of pages to include</small>
        </div>

        <div class="form-group horizontal-item">
          <label for="extra-functions">Extra Functions</label>
          <select
            id="extra-functions"
            v-model="pricing.extraFunctions"
            aria-required="true"
            aria-describedby="functions-desc"
          >
            <option value="" disabled selected>Choose (yes/no)</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <small id="functions-desc" class="sr-only">Whether to include additional functionality</small>
        </div>

        <div class="form-group horizontal-item">
          <label for="custom-animations">Custom Animations</label>
          <select
            id="custom-animations"
            v-model="pricing.customAnimations"
            aria-required="true"
            aria-describedby="animations-desc"
          >
            <option value="" disabled selected>Choose (yes/no)</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <small id="animations-desc" class="sr-only">Whether to include animations</small>
        </div>

        <div class="price-estimated">
          Price Calculator Estimated: <span>s/. {{ estimatedPrice }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="post-button" aria-label="Submit price configuration">Post</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  props: ['gigInfo'],
  data() {
    return {
      pricing: {
        daysDelivery: '',
        responsive: '',
        revisions: '',
        pages: '',
        extraFunctions: '',
        customAnimations: ''
      },
      estimatedPrice: 270
    };
  },
  methods: {
    handleSubmit() {
      const allData = { ...this.gigInfo, ...this.pricing };
      this.$emit('submit-all', allData);
    }
  }
};
</script>

<style scoped>
.pricing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: #f8f8f8;
  min-height: auto;
}

.pricing-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 15px;
  width: 450px;
  max-width: 90%;
  margin-bottom: 20px;
}

h3 {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
  font-weight: 500;
}

.description {
  color: #777;
  font-size: 0.75em;
  margin-bottom: 15px;
  text-align: left;
}

.form-group.horizontal-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.form-group.horizontal-item label {
  flex-basis: 40%;
  margin-right: 10px;
  text-align: left;
  font-size: 0.85em;
  color: #555;
  font-weight: 400;
}

.form-group.horizontal-item .select-wrapper {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.form-group.horizontal-item .select-wrapper select {
  width: 100%;
  padding: 5px 30px 5px 8px;
  border: none;
  font-size: 0.85em;
  box-sizing: border-box;
  color: #999;
  appearance: none;
  background: transparent;
}

.form-group.horizontal-item .select-wrapper select:focus {
  color: #333;
}

.form-group.horizontal-item .select-wrapper::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #999;
  pointer-events: none;
}

.form-group.horizontal-item .select-wrapper select:focus + .form-group.horizontal-item .select-wrapper::after {
  border-top-color: #333;
}

label {
  display: block;
  font-weight: 400;
  color: #555;
  margin-bottom: 3px;
  text-align: left;
  font-size: 0.85em;
}

.price-estimated {
  margin-top: 15px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  font-size: 0.8em;
  color: #555;
  text-align: left;
}

.price-estimated span {
  font-weight: 600;
  color: #00aeff;
}

.form-actions {
  text-align: center;
  width: 450px;
  max-width: 90%;
  margin-top: 20px;
}

.post-button {
  background-color: #29abe2;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 0.8em;
  cursor: pointer;
  font-weight: 400;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  width: 50%;

}

.post-button:hover {
  background-color: #1e88e5;
}


@media (max-width: 576px) {
  .pricing-card {
    width: 95%;
    padding: 15px;
  }

  .form-actions {
    width: 95%;
  }

  .form-group.horizontal-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-group.horizontal-item label {
    margin-bottom: 3px;
    width: 100%;
    text-align: left;
  }

  .form-group.horizontal-item .select-wrapper {
    width: 100%;
  }
}
</style>
