package entities;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Result implements Serializable {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private LocalDateTime checkTime;
    public Result(double x, double y, double r, boolean hit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.checkTime = LocalDateTime.now();
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }

    public String getCheckTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return checkTime.format(formatter);
    }

    public String getHitText() {
        return hit ? "Попала" : "Не попала";
    }
}