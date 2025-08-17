import API_KEYS from "./api_keys";
import { galleryGrid, generateBtn, imgCardTemplate } from "./selectors";

const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);

  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

  return { width: calculatedWidth, height: calculatedHeight };
};

const updataImageCard = (imgIndex, imgUrl) => {
  const imgCard = document.getElementById(`img-card-${imgIndex}`);
  if (!imgCard) return;

  imgCard.classList.remove("loading");
  imgCard.innerHTML = `<img src="${imgUrl}" alt="" class="result-img" />
                <div class="img-overlay">
                  <a href="${imgUrl}" type="button" class="img-download-btn" download="${Date.now()}.png">
                    <i class="fa-solid fa-download"></i>
                  </a>
                </div>`;
};

export const generateImages = async (
  promptText,
  AIModel,
  imageCount,
  apsectRadio
) => {
  let MODEL_URL;
  let requestBody;
  generateBtn.setAttribute("disabled", true);

  if (AIModel.includes("fal-ai")) {
    MODEL_URL = `https://router.huggingface.co/${AIModel}`;
    requestBody = {
      sync_mode: true,
      prompt: promptText,
    };
  } else {
    MODEL_URL = `https://router.huggingface.co/hf-inference/models/${AIModel}`;
    const { width, height } = getImageDimensions(apsectRadio);
    requestBody = {
      inputs: promptText,
      parameters: {
        width,
        height,
      },
    };
  }

  const randomAPIKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      const response = await fetch(MODEL_URL, {
        headers: {
          Authorization: `Bearer ${randomAPIKey}`,
          "Content-Type": "application/json",
          "x-use-cache": false,
        },
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error((await response.json())?.error);

      const contentType = response.headers.get("Content-Type");
      let imgUrl;

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        let base64Image = result.image_base64 || result.images[0].url;

        if (base64Image && base64Image.startsWith("data:image")) {
          imgUrl = base64Image;
        } else if (base64Image) {
          imgUrl = `data:image/jpeg;base64,${base64Image}`;
        } else {
          throw new Error("No image data found in JSON response.");
        }
      } else {
        const result = await response.blob();
        imgUrl = URL.createObjectURL(result);
      }

      updataImageCard(i, imgUrl);
    } catch (error) {
      const imgCard = document.getElementById(`img-card-${i}`);
      if (!imgCard) return;

      imgCard.classList.replace("loading", "error");
      imgCard.querySelector(".status-text").textContent = "Generation failed!";
    }
  });

  await Promise.allSettled(imagePromises);
  generateBtn.removeAttribute("disabled");
};

export const createImageCards = async (
  promptText,
  AIModel,
  imageCount,
  apsectRadio
) => {
  galleryGrid.innerHTML = "";

  for (let i = 0; i < imageCount; i++) {
    const cardTemplate = imgCardTemplate.content.cloneNode(true);
    const imgCard = cardTemplate.querySelector(".img-card");
    imgCard.setAttribute("id", `img-card-${i}`);
    imgCard.setAttribute("style", `aspect-ratio: ${apsectRadio}`);
    imgCard.classList.add("loading");
    galleryGrid.append(imgCard);

    requestAnimationFrame(() => {
      imgCard.classList.add("animate-in");
    });

    await new Promise((reslove) => setTimeout(reslove, 100));
  }

  generateImages(promptText, AIModel, imageCount, apsectRadio);
};
