package beans;

import entities.Result;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Named
@SessionScoped
public class AreaCheckBean implements Serializable {
    private Double x = 0.0;
    private Double y = 0.0;
    private Double r = 2.0;

    @Inject
    private ResultsBean resultsBean;

    public void checkPoint() {
        System.out.println("=== ПРОВЕРКА ТОЧКИ ===");
        System.out.println("Серверное время: " + java.time.LocalDateTime.now());

        boolean hit = checkHit(x, y, r);
        Result result = new Result(x, y, r, hit);

        System.out.println("Время в результате: " + result.getCheckTime());

        if (resultsBean != null) {
            resultsBean.addResult(result);
        }
    }

    private boolean checkHit(double x, double y, double r) {
        System.out.println("Проверяем точку (" + x + ", " + y + ") при R=" + r);

        boolean inQuarterCircle = (x <= 0 && y >= 0) &&
                (x * x + y * y <= (r/2) * (r/2));
        System.out.println("В четверти круга: " + inQuarterCircle);

        boolean inSquare = (x >= 0 && x <= r) &&
                (y >= 0 && y <= r);
        System.out.println("В квадрате: " + inSquare);

        boolean inTriangle = (x >= 0 && y <= 0) &&
                (y >= -0.5 * x) &&
                (x <= r) && (y >= -r/2);
        System.out.println("В треугольнике: " + inTriangle);

        boolean result = inQuarterCircle || inSquare || inTriangle;
        System.out.println("Итоговый результат: " + result);
        return result;
    }

    // Геттеры и сеттеры
    public Double getX() { return x; }
    public void setX(Double x) {
        this.x = x;
        System.out.println("X установлен: " + x);
    }

    public Double getY() { return y; }
    public void setY(Double y) {
        this.y = y;
        System.out.println("Y установлен: " + y);
    }

    public Double getR() { return r; }
    public void setR(Double r) {
        this.r = r;
        System.out.println("R установлен: " + r);
    }
}