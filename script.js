let currentStep = 1;

const nextStep = (step) => {
  if (validateStep(step)) {
    const current = document.getElementById(`step${step}`);
    const next = document.getElementById(`step${step + 1}`);

    // Aktif stepi yavaşça gizle
    current.classList.remove("active");

    // 300ms sonra yeni adımı aktif et
    setTimeout(() => {
      next.classList.add("active");
    }, 300); // CSS animasyon süresiyle uyumlu

    currentStep++;
    if (step === 3) displaySummary();
  }
};

const validateStep = (step) => {
  let inputs = document.querySelectorAll(`#step${step} input[required]`);
  console.log(inputs);
  return [...inputs].every((input) => {
    if (!input.value.trim()) {
      showAlert("Lütfen zorunlu alanları doldurunuz.", "danger");
      return false;
    }
    return true;
  });
};

const showAlert = (message, type) => {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `
    <div class="alert-custom" role="alert">
      <strong>Hata:</strong> ${message}
      <button type="button" class="btn-close mt-1" aria-label="Close" onclick="this.parentElement.remove()"></button>
    </div>
  `;
};

const prevStep = (step) => {
  const current = document.getElementById(`step${step}`);
  const prev = document.getElementById(`step${step - 1}`);

  current.classList.remove("active");

  setTimeout(() => {
    prev.classList.add("active");
  }, 300); // animasyon süresi ile uyumlu
  currentStep--;
};



const displaySummary = () => {
  const fields = {
    fullname: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    university: "Mezun Olunan Üniversite",
    department: "Bölüm",
    graduationYear: "Mezuniyet Yılı",
    company: "Çalıştığı Şirket",
    position: "Pozisyon",
    experience: "Çalışma Süresi (Yıl)",
  };

  let summaryText = "<ul>";

  for (const field in fields) {
    const value = document.getElementById(field).value.trim();
    if (value) {
      summaryText += `<li><strong>${fields[field]}:</strong>${value}</li>`;
    }
  }
  summaryText += "</ul>";
  document.getElementById("summary").innerHTML = summaryText;
};

// Post Request
document.getElementById("applicationForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    fullname: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    university: document.getElementById("university").value,
    department: document.getElementById("department").value,
    graduationYear: document.getElementById("graduationYear").value,
    company: document.getElementById("company").value,
    position: document.getElementById("position").value,
    experience: document.getElementById("experience").value,
  };

  console.log("Form gönderildi!");
  console.log(formData);

  sendFormData(formData);
});

const sendFormData = async (formData) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      showModal("Başarılı!", "Form başarıyla gönderildi.", true);
      console.log("Başarıyla gönderildi:", data);
    } else {
      console.error("Hata oluştu:", response.status, response.statusText);
    }
  } catch (error) {
    showModal("Hata!", "Form gönderilirken bir hata oluştu.", false);
    console.error("Bağlantı hatası:", error);
  }
};

// Result Modal
const showModal = (title, message, isSuccess) => {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;

  const modalHeader = document.getElementById("modalHeader");
  if (isSuccess) {
    modalHeader.classList.add("text-success");
    modalHeader.classList.remove("text-danger");
  } else {
    modalHeader.classList.add("text-danger");
    modalHeader.classList.remove("text-success");
  }

  const modal = new bootstrap.Modal(document.getElementById("myModal"));
  modal.show();

  document.getElementById("closeButton").addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("myModal"));
    modal.hide();
  });
};
