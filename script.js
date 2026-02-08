// script.js - IEEE SB STM Multi-Page Website Interactivity
// Features: Mobile menu toggle, form validation, active nav highlighting

document.addEventListener('DOMContentLoaded', function(){
  console.log('IEEE Student Branch website loaded');

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  
  if(menuToggle && mainNav){
    menuToggle.addEventListener('click', ()=>{
      mainNav.classList.toggle('active');
    });

    // Close menu when link is clicked
    mainNav.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A'){
        mainNav.classList.remove('active');
      }
    });
  }

  // ===== ACTIVE NAV HIGHLIGHTING (for multi-page) =====
  const navLinks = document.querySelectorAll('.main-nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Remove active class from all links first
    link.classList.remove('active');
    // Add active class to matching link
    if(href === currentPage || (currentPage === '' && href === 'index.html')){
      link.classList.add('active');
    }
  });

  // ===== CONTACT FORM VALIDATION & SUBMISSION =====
  const form = document.getElementById('contactForm');
  if(form){
    const statusElement = document.getElementById('formStatus');
    const inputs = {
      name: form.querySelector('[name="name"]'),
      email: form.querySelector('[name="email"]'),
      subject: form.querySelector('[name="subject"]'),
      message: form.querySelector('[name="message"]')
    };

    // Real-time validation
    inputs.name.addEventListener('blur', () => validateField(inputs.name, 'Name is required'));
    inputs.email.addEventListener('blur', () => validateEmail(inputs.email));
    inputs.subject.addEventListener('blur', () => validateField(inputs.subject, 'Subject is required'));
    inputs.message.addEventListener('blur', () => validateField(inputs.message, 'Message is required'));

    function validateField(field, errorMsg){
      if(field.value.trim() === ''){
        setFieldError(field, errorMsg);
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    }

    function validateEmail(field){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(field.value.trim() === ''){
        setFieldError(field, 'Email is required');
        return false;
      } else if(!emailRegex.test(field.value)){
        setFieldError(field, 'Please enter a valid email address');
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    }

    function setFieldError(field, msg){
      field.style.borderColor = '#ef4444';
      field.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(field){
      field.style.borderColor = '';
      field.setAttribute('aria-invalid', 'false');
    }

    // Form submission
    form.addEventListener('submit', function(e){
      e.preventDefault();
      
      // Validate all fields
      let isValid = true;
      isValid &= validateField(inputs.name, 'Name is required');
      isValid &= validateEmail(inputs.email);
      isValid &= validateField(inputs.subject, 'Subject is required');
      isValid &= validateField(inputs.message, 'Message is required');

      if(!isValid){
        updateStatus('Please fix the errors above.', 'error');
        return;
      }

      // Disable submit button during submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulate form submission
      updateStatus('Sending your message...', 'info');

      setTimeout(()=>{
        // Reset form
        form.reset();
        
        // Update status
        updateStatus(
          '✓ Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.',
          'success'
        );

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Clear status after 5 seconds
        setTimeout(()=>{
          statusElement.textContent = '';
        }, 5000);
      }, 1200);
    });

    function updateStatus(msg, type){
      statusElement.textContent = msg;
      statusElement.style.color = 
        type === 'error' ? '#dc2626' : 
        type === 'success' ? '#22c55e' : 
        type === 'info' ? '#0a57a4' : '#000';
      
      if(type === 'success' || type === 'error'){
        statusElement.style.backgroundColor = 
          type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
          type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'transparent';
        statusElement.style.borderLeft = 
          type === 'error' ? '3px solid #ef4444' :
          type === 'success' ? '3px solid #22c55e' : 'none';
      }
    }
  }

  // ===== FAQ TOGGLE =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    if(summary){
      summary.addEventListener('click', ()=>{
        // Close other open items
        faqItems.forEach(otherItem => {
          if(otherItem !== item && otherItem.open){
            otherItem.open = false;
          }
        });
      });
    }
  });

  // ===== EVENT REGISTRATION FORM (Simple - Registration Page) =====
  const eventForm = document.getElementById('eventRegistrationForm');
  if(eventForm){
    const statusElement = document.getElementById('formStatus');
    
    // Retrieve event name from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const eventNameParam = urlParams.get('event');
    const eventNameField = document.getElementById('eventName');
    const eventInfoDisplay = document.getElementById('eventInfoDisplay');
    const eventDisplayName = document.getElementById('eventDisplayName');
    
    // Populate event name field if parameter exists
    if(eventNameField && eventNameParam){
      eventNameField.value = decodeURIComponent(eventNameParam);
      
      // Show event info display
      if(eventInfoDisplay && eventDisplayName){
        eventDisplayName.textContent = decodeURIComponent(eventNameParam);
        eventInfoDisplay.style.display = 'block';
      }
    }
    
    const inputs = {
      eventName: eventNameField,
      fullName: eventForm.querySelector('[name="fullName"]'),
      email: eventForm.querySelector('[name="email"]'),
      phone: eventForm.querySelector('[name="phone"]'),
      branchRadios: eventForm.querySelectorAll('[name="branch"]'),
      batchRadios: eventForm.querySelectorAll('[name="batch"]'),
      membershipRadios: eventForm.querySelectorAll('[name="membershipStatus"]'),
      membershipId: eventForm.querySelector('[name="membershipId"]'),
      membershipIdGroup: document.getElementById('membershipIdGroup')
    };

    // Handle membership status radio buttons - show/hide Membership ID field
    inputs.membershipRadios.forEach(radio => {
      radio.addEventListener('change', function(){
        if(this.value === 'yes'){
          inputs.membershipIdGroup.style.display = 'block';
          inputs.membershipId.required = true;
        } else {
          inputs.membershipIdGroup.style.display = 'none';
          inputs.membershipId.required = false;
          inputs.membershipId.value = '';
          clearFieldError(inputs.membershipId);
        }
      });
    });

    // Real-time validation
    if(inputs.fullName) inputs.fullName.addEventListener('blur', () => validateField(inputs.fullName, 'Full Name is required'));
    if(inputs.email) inputs.email.addEventListener('blur', () => validateEmail(inputs.email));
    if(inputs.phone) inputs.phone.addEventListener('blur', () => validateField(inputs.phone, 'Phone Number is required'));
    
    // Branch radio validation
    inputs.branchRadios.forEach(radio => {
      radio.addEventListener('change', () => validateRadioGroup(inputs.branchRadios, 'Please select a branch'));
    });
    
    // Batch radio validation
    inputs.batchRadios.forEach(radio => {
      radio.addEventListener('change', () => validateRadioGroup(inputs.batchRadios, 'Please select a batch'));
    });
    
    if(inputs.membershipId) inputs.membershipId.addEventListener('blur', function(){
      if(this.required === true){
        validateField(inputs.membershipId, 'IEEE Membership ID is required');
      }
    });

    function validateField(field, errorMsg){
      if(field.value.trim() === ''){
        setFieldError(field, errorMsg);
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    }

    function validateEmail(field){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(field.value.trim() === ''){
        setFieldError(field, 'Email is required');
        return false;
      } else if(!emailRegex.test(field.value)){
        setFieldError(field, 'Please enter a valid email address');
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    }

    function setFieldError(field, msg){
      field.style.borderColor = '#ef4444';
      field.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(field){
      field.style.borderColor = '';
      field.setAttribute('aria-invalid', 'false');
    }

    function validateRadioGroup(radioGroup, errorMsg){
      const isSelected = Array.from(radioGroup).some(radio => radio.checked);
      if(!isSelected){
        const firstRadio = radioGroup[0];
        setRadioGroupError(firstRadio.closest('.radio-group'), errorMsg);
        return false;
      } else {
        const firstRadio = radioGroup[0];
        clearRadioGroupError(firstRadio.closest('.radio-group'));
        return true;
      }
    }

    function setRadioGroupError(radioGroup, msg){
      if(radioGroup){
        radioGroup.style.borderLeft = '3px solid #ef4444';
        radioGroup.style.paddingLeft = '0.75rem';
      }
    }

    function clearRadioGroupError(radioGroup){
      if(radioGroup){
        radioGroup.style.borderLeft = '';
        radioGroup.style.paddingLeft = '';
      }
    }

    // Form submission
    eventForm.addEventListener('submit', function(e){
      e.preventDefault();
      
      // Check if event name is present
      if(!inputs.eventName || !inputs.eventName.value.trim()){
        updateEventStatus('Please select an event to register. Return to the Events page and click a specific event.', 'error');
        return;
      }
      
      // Check if membership status is selected
      const membershipSelected = Array.from(inputs.membershipRadios).some(radio => radio.checked);

      // Validate all required fields
      let isValid = true;
      isValid &= validateField(inputs.fullName, 'Full Name is required');
      isValid &= validateEmail(inputs.email);
      isValid &= validateField(inputs.phone, 'Phone Number is required');
      isValid &= validateRadioGroup(inputs.branchRadios, 'Please select a branch');
      isValid &= validateRadioGroup(inputs.batchRadios, 'Please select a batch');

      if(!membershipSelected){
        updateEventStatus('Please select IEEE Membership Status', 'error');
        return;
      }

      // If Yes is selected, validate Membership ID
      const membershipYes = Array.from(inputs.membershipRadios).find(radio => radio.value === 'yes' && radio.checked);
      if(membershipYes){
        isValid &= validateField(inputs.membershipId, 'IEEE Membership ID is required');
      }

      if(!isValid){
        updateEventStatus('Please fill in all required fields', 'error');
        return;
      }

      // Collect form data
      const formData = {
        eventName: inputs.eventName.value,
        fullName: inputs.fullName.value,
        email: inputs.email.value,
        phone: inputs.phone.value,
        branch: Array.from(inputs.branchRadios).find(radio => radio.checked).value,
        batch: Array.from(inputs.batchRadios).find(radio => radio.checked).value,
        membershipStatus: Array.from(inputs.membershipRadios).find(radio => radio.checked).value,
        membershipId: membershipYes ? inputs.membershipId.value : null,
        timestamp: new Date().toISOString()
      };

      // Show processing status
      const submitBtn = eventForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      updateEventStatus('Processing your registration...', 'info');

      // Simulate submission
      setTimeout(()=>{
        // Store form data in localStorage (for demo purposes)
        let registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
        registrations.push(formData);
        localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

        // Reset form
        eventForm.reset();
        inputs.membershipIdGroup.style.display = 'none';
        inputs.membershipId.required = false;
        
        // Re-populate event name field after reset
        if(inputs.eventName && eventNameParam){
          inputs.eventName.value = decodeURIComponent(eventNameParam);
        }
        
        // Update status with success message
        updateEventStatus(
          `✓ Successfully registered for "${formData.eventName}"! Check your email ${inputs.email.value} for confirmation and event details.`,
          'success'
        );

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Clear status after 6 seconds
        setTimeout(()=>{
          statusElement.classList.remove('show');
        }, 6000);
      }, 1000);
    });

    function updateEventStatus(msg, type){
      statusElement.textContent = msg;
      statusElement.className = 'form-status show';
      statusElement.classList.add(type === 'error' ? 'error' : 'success');
    }
  }

  console.log('All interactive features loaded');
});

