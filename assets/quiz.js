
  document.addEventListener("DOMContentLoaded", function() {



    let quizSlider = document.querySelector(".quiz-slider");
    let quizResults = [];
    let selectedProducts = [];
    let quizBtn = document.querySelector(".quiz-btn");





    document.querySelectorAll('.question-input').forEach(input => {
      input.addEventListener('change', function() {
        const products = JSON.parse(this.dataset.products || '[]');
        if (this.checked) {
          quizResults.push(...products);
        } else {
          quizResults = quizResults.filter(p => !products.includes(p));
        }
        console.log('Selected Products:', quizResults);
      });
    });



    document.getElementById('submit-quiz').addEventListener('click', function() {
      const productFrequency = {};
      let mostFrequentProduct = null;
      let maxCount = 0;

      quizResults.forEach(product => {
        const productId = JSON.stringify(product);
        if (!productFrequency[productId]) {
          productFrequency[productId] = { count: 0, product };
        }
        productFrequency[productId].count++;

        if (productFrequency[productId].count > maxCount) {
          maxCount = productFrequency[productId].count;
          mostFrequentProduct = productFrequency[productId].product;
        }
      });

      console.log('Most Recommended Product:', mostFrequentProduct);
      displayRecommendedProduct(mostFrequentProduct);
    });



    function displayRecommendedProduct(product) {
      document.querySelector('#submit-quiz').style.display = 'none';
      quizSlider.style.display = 'none';
    
      const container = document.getElementById('recommended-products-container');
      container.innerHTML = ''; // Clear previous results
      
      // Create product element
      const productElement = document.createElement('div');
      productElement.classList.add('result-stack');
      
      // Create carousel container
      const carouselContainer = document.createElement('div');
      carouselContainer.classList.add('carousel-container');
    
      // Create carousel track
      const carouselTrack = document.createElement('div');
      carouselTrack.classList.add('carousel-track');
    
      // Add images to carousel track
      product.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image; // URL of the image
        img.alt = product.title;
        img.classList.add('carousel-image');
        carouselTrack.appendChild(img);
      });
    
      carouselContainer.appendChild(carouselTrack);
    
      // Create navigation buttons
      const prevButton = document.createElement('button');
      prevButton.classList.add('carousel-button', 'carousel-button-prev');
      prevButton.textContent = '‹';
      prevButton.addEventListener('click', () => slideCarousel(-1));
    
      const nextButton = document.createElement('button');
      nextButton.classList.add('carousel-button', 'carousel-button-next');
      nextButton.textContent = '›';
      nextButton.addEventListener('click', () => slideCarousel(1));
    
      carouselContainer.appendChild(prevButton);
      carouselContainer.appendChild(nextButton);
    
      // Create "View Product" button
      const viewProductBtn = document.createElement('a');
      viewProductBtn.textContent = 'View Product';
      viewProductBtn.classList.add('view-product-button');
      viewProductBtn.href = `/products/${product.handle}`; // Assuming the URL format is /products/{handle}
    
      // Create "Add to Cart" button
      const addToCartBtn = document.createElement('button');
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.classList.add('add-to-cart-button');
      addToCartBtn.addEventListener('click', () => addToCart(product.id));
    
      // Create reset button
      const resetBtn = document.createElement('button');
      resetBtn.textContent = 'Take the Quiz Again'; 
      resetBtn.classList.add('reset-button');
      resetBtn.addEventListener("click", resetQuiz);
    
      // Append elements to the container
      productElement.appendChild(carouselContainer);
      productElement.appendChild(viewProductBtn);
      productElement.appendChild(addToCartBtn);
      productElement.appendChild(resetBtn);
      
      container.appendChild(productElement);
    
      document.getElementById('quiz-results').style.display = 'block';
    }
    


    function slideCarousel(direction) {
      const track = document.querySelector('.carousel-track');
      const currentTransform = getComputedStyle(track).transform;
      const matrix = new DOMMatrix(currentTransform);
      const slideWidth = track.firstElementChild.clientWidth;
      const newTransformX = matrix.m41 - direction * slideWidth;
    
      track.style.transform = `translateX(${newTransformX}px)`;
      console.log(newTransformX);
    }
    



    function addToCart(productId) {
      // Implement the logic to add the product to the cart
      console.log('Adding product to cart:', productId);
      // Example: Add product to Shopify cart
      fetch(`/cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: productId,
            quantity: 1
          }]
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Product added to cart:', data);
        // Optionally, redirect to cart or show a confirmation message
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
    }




    function resetQuiz() {
      quizSlider.style.display = 'flex';
      const container = document.getElementById('recommended-products-container');
      container.style.display = 'none';
      document.querySelectorAll('.question-input').forEach(input => {
        input.checked = false;
      });
      quizResults = [];
      selectedProducts = [];
      resetToFirstQuestion()
    }
    
    



    function startQuiz() {
      console.log("Tetsing");
      quizSlider.style.display = 'flex'
      quizBtn.style.display = 'none';

    }





    function nextQuestion() {
      const quizQuestion = document.querySelector('.quiz-question').offsetWidth;
      
      // Calculate the next scroll position
      const currentQuestion = quizSlider.scrollLeft;
      const nextQuest = currentQuestion + quizQuestion;
  
      // Hide the submit button initially
      document.getElementById('submit-quiz').style.display = 'none';
  
      // Scroll to the next item
      quizSlider.scrollTo({
          left: nextQuest,
          behavior: 'smooth' // Adds smooth scrolling animation
      });
  
      // Check if it is the last item
      const totalItems = document.querySelectorAll('.quiz-question').length;
      const currentIndex = Math.round(nextQuest / quizQuestion);
  
      if (currentIndex >= totalItems - 1) {
          // Show the submit button if it is the last item
          document.getElementById('submit-quiz').style.display = 'block';
      }
  }




  function resetToFirstQuestion() {
    console.log('resetToFirstQuestion');
    quizSlider.scrollTo({
        left: 0,
        behavior: 'smooth' // Adds smooth scrolling animation
    });
}




function addAnswerListeners() {
      let inputs = document.querySelectorAll('.question-input');
      inputs.forEach(input => {
        let labelText = input.closest('.quiz-block').querySelector('label');
        if (labelText && !labelText.textContent.trim()) {
          input.closest('.quiz-block').style.display = 'none';
        } else {
          input.addEventListener('change', nextQuestion);
        }
      });
    }

    
    let questions = document.querySelectorAll('.quiz-question');
    let currentQuestionIndex = 0;

    if (quizBtn) {
      quizBtn.addEventListener("click", startQuiz);
      addAnswerListeners();
    } else {
      console.error("Quiz button not found");
    }
  });