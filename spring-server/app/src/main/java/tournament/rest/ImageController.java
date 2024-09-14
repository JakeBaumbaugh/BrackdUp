package tournament.rest;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import tournament.model.Image;
import tournament.model.Profile;
import tournament.model.Tournament;
import tournament.service.ImageService;
import tournament.service.ProfileService;
import tournament.service.TournamentService;

@RestController
@RequestMapping("/image")
public class ImageController {
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    private TournamentService tournamentService;
    private ProfileService profileService;
    private ImageService imageService;

    @Autowired
    public ImageController(TournamentService tournamentService, ProfileService profileService, ImageService imageService) {
        this.tournamentService = tournamentService;
        this.profileService = profileService;
        this.imageService = imageService;
    }

    // Get list of images for tournament background
    @GetMapping("list")
    public List<Integer> getImageList(Authentication authentication) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request to list images from user {}", profile != null ? profile.getName() : null);

        return imageService.listImages();
    }

    // Get image data by image id for tournament background
    @GetMapping(value = "", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getImage(Authentication authentication, @RequestParam Integer id) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request to get image {} from user {}", id, profile != null ? profile.getName() : null);

        return imageService.getImage(id)
                .map(Image::getData)
                .orElseThrow(() -> create404("Image not found."));
    }

    // Get image data by tournament id for tournament bcakground
    @GetMapping(value = "tournament", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getTournamentBackgroundImage(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request to get background image for tournament {} from user {}", tournamentId, profile != null ? profile.getName() : null);

        if (!profileService.profileCanView(profile, tournamentId)) {
            throw create404("Image not found.");
        }

        return tournamentService.getTournament(tournamentId)
                .map(Tournament::getBackgroundImageId)
                .flatMap(imageId -> imageService.getImage(imageId))
                .map(Image::getData)
                .orElseThrow(() -> create404("Image not found."));
    }

    private ResponseStatusException create404(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(404), message);
    }
}