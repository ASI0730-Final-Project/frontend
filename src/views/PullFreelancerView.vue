<template>
  <div>

    <div class="zoom-container">

      <div class="section-layout">
        <div class="text-container">
          <div class="details-box">
            <h3 class="price-header">
              <strong class="label-text">Start Price:</strong>
              <strong class="start-price">s/.310</strong>
            </h3>
            <div class="details-content">
              <p><strong>Days Delivery: 5</strong></p>
              <p><strong>Responsive: yes</strong></p>
              <p><strong>Revisions: 2</strong></p>
              <p><strong>Pages: 6</strong></p>
              <p><strong>Custom Animations: ✅</strong></p>
            </div>
          </div>

          <div class="price-box">
            <h3 class="price-header">
              <strong class="label-text">Actual Price:</strong>
              <strong class="actual-price">{{ currentPrice }}</strong>
            </h3>
            <div class="spacer"></div>
            <button class="accept-btn">Accept</button>
          </div>
        </div>

        <div class="chat-box-container">
          <img src="@/assets/ChatBox.png" alt="Chatbox" class="chat-box" />
        </div>
      </div>

      <div class="image-below-container">
        <img src="@/assets/imageDesign.png" alt="Design Image" class="image-below" />
      </div>
    </div>

    <div class="text-input-container">
      <textarea class="text-input" placeholder="Write a Message"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompactPriceSection',
  data() {
    return {
      currentPrice: 285
    };
  }
};
</script>

<style scoped>
.zoom-container {
  transition: transform 0.2s ease-in-out;
  transform-origin: center center;
}

.text-container {
  display: flex;
  gap: 15px;
  width: 36%;
  margin: 90px 40px 0 auto;
  font-size: 1.05em;
  position: relative;
  justify-content: center;
}

.details-box,
.price-box {
  flex: 1;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 200px;
  max-width: 48%;
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

.price-header {
  font-size: 1.5em;
  text-align: center;
  margin: 10px 0;
}

.label-text {
  color: #58c5e0;
}

.start-price {
  font-size: 1.2em;
  color: rgb(0, 0, 0);
  margin-left: 6px;
}

.actual-price {
  font-size: 1.1em;
  color: #58c5e0;
  margin-left: 6px;
}

.details-content {
  text-align: center;
  color: #555;
}

.details-content p {
  margin: 8px 0;
  font-size: 0.9em;
}

.spacer {
  flex-grow: 1;
}

.accept-btn {
  align-self: center;
  width: 40%;
  padding: 10px;
  font-size: 0.9em;
  background-color: #58c5e0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 70px;
}

.accept-btn:hover {
  background-color: #4db8d1;
}

.section-layout {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
}

.chat-box-container {
  width: 35%;
  max-width: 26%;
  margin-left: 30px;
  margin-top: 80px;
  margin-right: 450px;
  position: relative;
  z-index: 10;
}

.chat-box {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.image-below-container {
  width: 35%;
  max-width: 100%;
  margin: 0 auto;
  margin-top: -17%;
  margin-left: 18%;
  position: relative;
  z-index: 5;
}

.image-below {
  width: 100%;
  border-radius: 30px;
}

.text-input-container {
  width: 100%;
  margin-top: 20px;
  text-align: center;
}

.text-input {
  width: 24%;
  height: 80px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 1em;
  resize: none;
  position: relative;
  left: 19%;
  top: -120px;
  color: black;
  background-color: white;
  z-index: 11;
}

.text-input::placeholder {
  font-size: 1.5em;
  color: #ccc;
}
</style>
