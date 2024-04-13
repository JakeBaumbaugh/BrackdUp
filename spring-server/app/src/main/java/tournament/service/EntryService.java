package tournament.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.micrometer.common.util.StringUtils;
import tournament.model.Entry;
import tournament.repository.EntryRepository;

@Service
public class EntryService {
    
    private EntryRepository entryRepository;

    @Autowired
    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public List<Entry> findAll() {
        return entryRepository.findAll();
    }

    public List<Entry> findAllById(List<Integer> entryIds) {
        return entryRepository.findAllById(entryIds);
    }

    public List<Entry> saveAll(List<Entry> entries) {
        return entryRepository.saveAll(entries);
    }

    /**
     * Returns a list of entries that match the given criteria. MISC type will return all other entry types.
     * @param type      Entry type - required
     * @param line1     Entry line1 - optional
     * @param line2     Entry line2 - optional
     * @return          List of entries that satisfy type, line1, and line2
     */
    public List<Entry> search(String type, String line1, String line2) {
        boolean line1IsBlank = StringUtils.isBlank(line1);
        boolean line2IsBlank = StringUtils.isBlank(line2);
        // Do not search on empty criteria
        if (line1IsBlank && line2IsBlank) {
            return List.of();
        }
        // For security of personal tournaments, do not show MISC options when searching entries
        if ("MISC".equals(type)) {
            // If type is MISC, return all entries other than MISC
            if (line1IsBlank) {
                return entryRepository.findByTypeNotAndLine2ContainingIgnoreCase(type, line2);
            } else if (line2IsBlank) {
                return entryRepository.findByTypeNotAndLine1ContainingIgnoreCase(type, line1);
            } else {
                return entryRepository.findByTypeNotAndLine1ContainingIgnoreCaseAndLine2ContainingIgnoreCase(type, line1, line2);
            }
        } else {
            // Otherwise, return all entries that match type
            if (line1IsBlank) {
                return entryRepository.findByTypeAndLine2ContainingIgnoreCase(type, line2);
            } else if (line2IsBlank) {
                return entryRepository.findByTypeAndLine1ContainingIgnoreCase(type, line1);
            } else {
                return entryRepository.findByTypeAndLine1ContainingIgnoreCaseAndLine2ContainingIgnoreCase(type, line1, line2);
            }
        }
    }
}
