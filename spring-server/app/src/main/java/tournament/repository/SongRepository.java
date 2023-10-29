package tournament.repository;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Song;

public interface SongRepository extends ListCrudRepository<Song, Integer> {
    List<Song> findByTitleContainingIgnoreCase(String title);
    List<Song> findByArtistContainingIgnoreCase(String title);
}
