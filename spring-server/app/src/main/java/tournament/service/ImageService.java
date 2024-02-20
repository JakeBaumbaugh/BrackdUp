package tournament.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.model.Image;
import tournament.repository.ImageRepository;

@Service
public class ImageService {
    
    private ImageRepository imageRepository;

    @Autowired
    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public List<Integer> listImages() {
        return imageRepository.findAllIds();
    }

    public Optional<Image> getImage(Integer id) {
        return imageRepository.findById(id);
    }

    public Image saveImage(String base64) {
        byte[] data = decodeBase64(base64);
        String hash = generateHash(data);
        return imageRepository.findByHash(hash)
                .orElseGet(() -> {
                    Image image = new Image();
                    image.setData(data);
                    image.setHash(hash);
                    return imageRepository.save(image);
                });
    }

    private byte[] decodeBase64(String base64) {
        String data = base64.contains(",") ? base64.split(",", 2)[1] : base64;
        return Base64.getDecoder().decode(data);
    }

    private String generateHash(byte[] data) {
        // Generate hash data
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
        md.update(data);
        byte[] digest = md.digest();

        // Convert to hex string
        StringBuilder hexString = new StringBuilder();
        for (byte b : digest) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}
