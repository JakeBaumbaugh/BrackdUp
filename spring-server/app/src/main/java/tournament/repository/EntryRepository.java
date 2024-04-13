package tournament.repository;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Entry;

public interface EntryRepository extends ListCrudRepository<Entry, Integer> {
    List<Entry> findByTypeAndLine1ContainingIgnoreCase(String type, String line1);
    List<Entry> findByTypeNotAndLine1ContainingIgnoreCase(String type, String line1);
    List<Entry> findByTypeAndLine2ContainingIgnoreCase(String type, String line2);
    List<Entry> findByTypeNotAndLine2ContainingIgnoreCase(String type, String line2);
    List<Entry> findByTypeAndLine1ContainingIgnoreCaseAndLine2ContainingIgnoreCase(String type, String line1, String line2);
    List<Entry> findByTypeNotAndLine1ContainingIgnoreCaseAndLine2ContainingIgnoreCase(String type, String line1, String line2);
}
