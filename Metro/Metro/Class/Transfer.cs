using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Metro
{
    public class Transfer
    {
        private static readonly Style style = (Style)Application.Current.MainWindow.FindResource("transfer1");
        private static readonly Style style2 = (Style)Application.Current.MainWindow.FindResource("transfer2");

        private PointCollection points = new();

        public float Dist
        {
            get;
        }

        public (Station st1, Station st2) Station
        {
            get;
        }

        public Transfer(float distance, (Station st1, Station st2) station)
        {
            Dist = distance;
            Station = station;

            if (station.st1 != null) points.Add(new Point(station.st1.Position.x, station.st1.Position.y));

            if (station.st2 != null) points.Add(new Point(station.st2.Position.x, station.st2.Position.y));
        }
        public void Draw()
        {
            Polyline polyline = new()
            {
                Style = style,
                Points = points,
            };
            Polyline polyline2 = new()
            {
                Style = style2,
                Points = points,
            };
            //Debug.WriteLine(polyline.Points);
            Subway.canvas.Children.Add(polyline);
            Subway.canvas.Children.Add(polyline2);
        }
    }
}