import React, { useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CloudinaryUpload = ({ onUploadSuccess, buttonText = "Upload with Cloudinary" }) => {
  const [uploading, setUploading] = useState(false);
  const widgetRef = useRef(null);
  const buttonRef = useRef(null);
  const isMounted = useRef(true);

  // Cloudinary configuration
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'sjs_payment_screenshots';

  useEffect(() => {
    isMounted.current = true;
    
    // Load Cloudinary widget script
    const loadCloudinaryWidget = () => {
      if (window.cloudinary && !widgetRef.current) {
        try {
          widgetRef.current = window.cloudinary.createUploadWidget(
            {
              cloudName: cloudName,
              uploadPreset: uploadPreset,
              folder: 'sjs-academy/payments',
              sources: ['local', 'camera'],
              multiple: false,
              cropping: false,
              maxFileSize: 5000000,
              clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
              showAdvancedOptions: false,
              styles: {
                palette: {
                  window: "#FFFFFF",
                  sourceBg: "#F4F4F4",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  inactiveTabIcon: "#69778A",
                  menuIcons: "#0078FF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inProgress: "#0078FF",
                  complete: "#00B4FF",
                  error: "#FF0000",
                  textDark: "#000000",
                  textLight: "#FFFFFF"
                }
              }
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary widget error:", error);
                if (isMounted.current) {
                  toast.error("Upload widget error. Please try again.");
                }
                return;
              }
              
              if (result && result.event === 'success') {
                console.log("Upload successful:", result.info);
                if (isMounted.current && onUploadSuccess) {
                  onUploadSuccess({
                    url: result.info.secure_url,
                    publicId: result.info.public_id,
                    filename: result.info.original_filename
                  });
                }
                if (isMounted.current) {
                  toast.success('Screenshot uploaded successfully!');
                }
              } else if (result && result.event === 'close') {
                console.log("Widget closed");
              }
            }
          );
        } catch (err) {
          console.error("Error creating widget:", err);
        }
      }
    };

    // Check if script is already loaded
    if (window.cloudinary) {
      loadCloudinaryWidget();
    } else {
      // Load script
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = loadCloudinaryWidget;
      script.onerror = () => {
        console.error("Failed to load Cloudinary widget script");
        if (isMounted.current) {
          toast.error("Failed to load upload widget. Please refresh and try again.");
        }
      };
      document.body.appendChild(script);
    }

    return () => {
      isMounted.current = false;
      if (widgetRef.current) {
        try {
          // Don't destroy, just clear reference
          widgetRef.current = null;
        } catch (err) {
          console.error("Error cleaning up widget:", err);
        }
      }
    };
  }, [cloudName, uploadPreset, onUploadSuccess]);

  const handleOpenWidget = () => {
    if (widgetRef.current) {
      try {
        widgetRef.current.open();
      } catch (err) {
        console.error("Error opening widget:", err);
        toast.error("Please refresh the page and try again.");
      }
    } else {
      toast.error("Upload widget is not ready. Please refresh the page.");
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleOpenWidget}
      disabled={uploading}
      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {uploading ? (
        <FaSpinner className="animate-spin" />
      ) : (
        <FaCloudUploadAlt />
      )}
      {uploading ? 'Uploading...' : buttonText}
    </button>
  );
};

export default CloudinaryUpload;