package sample;

import javafx.scene.chart.XYChart;

public class Heun extends NumericalMethod{

	@Override
    public XYChart.Series<String, Number> computeApproximation() {
        double x[] = new double[N];
        double y[] = new double[N];
       double h = (X - X0) / N;

        XYChart.Series heunApproximation = new XYChart.Series();
        heunApproximation.setName(name);

        x[0]=X0;
        y[0]=Y0;

        for (int i = 1; i < N; i++) {
            x[i] = x[i-1] + h;
        }

        for (int i = 1; i < N; i++) {
            double p1 = Math.cos(x[i-1]) - y[i-1]; 
            double p2 = Math.cos(x[i-1] + h/3) - y[i-1]-h*p1/3;
            double p3 = Math.cos(x[i-1] + 2*h/3) - y[i-1]-h*p2/2;


            y[i]=y[i-1] + h*(0.25*p1+ 0.75*p3);
        }

        for (int i = 0; i < N; i++) {
        	heunApproximation.getData().add(new XYChart.Data(x[i], y[i]));
        }
        heunApproximation.setName("Method Heun");
        return heunApproximation;
    }

    public Heun (double x0, double y0, int n, double x) {
        super(x0, y0, n, x);
        name = "Method Heun";
    }
	
}
