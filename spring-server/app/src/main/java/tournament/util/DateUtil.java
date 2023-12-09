package tournament.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DateUtil {
    private static final ZoneId EASTERN = ZoneId.of("America/New_York");

    // Hide constructor
    private DateUtil() {}

    public static LocalDateTime zonedToLocal(ZonedDateTime zdt) {
        return zdt != null ? zdt.withZoneSameInstant(EASTERN).toLocalDateTime() : null;
    }

    public static ZonedDateTime localToZoned(LocalDateTime ldt) {
        return ldt != null ? ldt.atZone(EASTERN) : null;
    }
}
