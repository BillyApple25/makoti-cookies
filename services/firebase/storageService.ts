import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  StorageReference 
} from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

export class StorageService {
  // Upload product image
  static async uploadProductImage(file: File, productId: string): Promise<{ url: string; path: string }> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const imagePath = `products/${productId}/${fileName}`;
      const imageRef = ref(storage, imagePath);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: imagePath
      };
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw new Error('Failed to upload product image');
    }
  }

  // Upload user profile image
  static async uploadUserProfileImage(file: File, userId: string): Promise<{ url: string; path: string }> {
    try {
      const fileName = `profile_${Date.now()}_${file.name}`;
      const imagePath = `users/${userId}/${fileName}`;
      const imageRef = ref(storage, imagePath);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: imagePath
      };
    } catch (error) {
      console.error('Error uploading user profile image:', error);
      throw new Error('Failed to upload profile image');
    }
  }

  // Upload multiple product images
  static async uploadMultipleProductImages(files: File[], productId: string): Promise<Array<{ url: string; path: string }>> {
    try {
      const uploadPromises = files.map(file => this.uploadProductImage(file, productId));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple product images:', error);
      throw new Error('Failed to upload product images');
    }
  }

  // Delete image by path
  static async deleteImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${imagePath}`);
    }
  }

  // Delete all product images
  static async deleteAllProductImages(productId: string): Promise<void> {
    try {
      const productImagesRef = ref(storage, `products/${productId}`);
      const listResult = await listAll(productImagesRef);
      
      const deletePromises = listResult.items.map(itemRef => deleteObject(itemRef));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting product images:', error);
      throw new Error(`Failed to delete images for product: ${productId}`);
    }
  }

  // Get download URL from path
  static async getDownloadURL(imagePath: string): Promise<string> {
    try {
      const imageRef = ref(storage, imagePath);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error(`Failed to get download URL for: ${imagePath}`);
    }
  }

  // Upload general file (for documents, etc.)
  static async uploadFile(file: File, folder: string, customName?: string): Promise<{ url: string; path: string }> {
    try {
      const fileName = customName || `${Date.now()}_${file.name}`;
      const filePath = `${folder}/${fileName}`;
      const fileRef = ref(storage, filePath);
      
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Validate image file
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Please upload images smaller than 5MB.'
      };
    }

    return { isValid: true };
  }

  // Resize image before upload (using canvas)
  static async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Get storage reference
  static getStorageRef(path: string): StorageReference {
    return ref(storage, path);
  }

  // List files in a directory
  static async listFiles(directory: string): Promise<string[]> {
    try {
      const dirRef = ref(storage, directory);
      const listResult = await listAll(dirRef);
      
      const urlPromises = listResult.items.map(itemRef => getDownloadURL(itemRef));
      return await Promise.all(urlPromises);
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`Failed to list files in directory: ${directory}`);
    }
  }
} 