package beans;

import entities.Result;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;

@Named("areaCheck")
@SessionScoped
public class AreaCheckBean implements Serializable {
    private Double x = 0.0;
    private Double y = 0.0;
    private Double r = 2.0;

    @Inject
    private ResultsBean resultsBean;

    public void checkPoint() {
        System.out.println("=== AreaCheckBean: Проверка точки ===");
        System.out.println("Параметры: x=" + x + ", y=" + y + ", r=" + r);

        boolean hit = checkHit(x, y, r);
        Result result = new Result(x, y, r, hit);

        if (resultsBean != null) {
            resultsBean.addResult(result);
        } else {
            System.err.println("ОШИБКА: ResultsBean не инжектирован!");
        }
    }

    // Метод checkHit() остается без изменений
    private boolean checkHit(double x, double y, double r) {
        boolean inQuarterCircle = (x <= 0 && y >= 0) && (x * x + y * y <= (r/2) * (r/2));
        boolean inSquare = (x >= 0 && x <= r) && (y >= 0 && y <= r);
        boolean inTriangle = (x >= 0 && y <= 0) && (y >= 0.5 * x - (r/2)) && (x <= r) && (y >= -r/2);
        return inQuarterCircle || inSquare || inTriangle;
    }

    // Геттеры/сеттеры остаются без изменений
    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }
    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }
    public Double getR() { return r; }
    public void setR(Double r) { this.r = r; }
}