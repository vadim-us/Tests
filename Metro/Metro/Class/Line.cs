using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Metro
{
    public class Line
    {
        private static readonly Style style = (Style)Application.Current.MainWindow.FindResource("line");
        public SolidColorBrush Color { get; }

        public static int NewID
        {
            get; set;
        }
        public string ID { get; }

        private List<Station> stations = new();
        public List<Station> Stations
        {
            get => stations;
            set
            {
                Station.NewID = 0;
                stations = value;
            }
        }

        public bool Visited { get; set; }

        public PointCollection Points { get; set; } = new PointCollection();

        public Line(SolidColorBrush color)
        {
            ID = $"L{NewID++}";
            Color = color;
        }

        public void Draw()
        {
            Polyline polyline = new()
            {
                Style = style,
                Points = Points,
                Stroke = Color
            };

            Subway.canvas.Children.Add(polyline);
        }
    }
}