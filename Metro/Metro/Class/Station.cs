using System.Collections.Generic;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Metro
{
    public class Path
    {
        public float Weight
        {
            get; set;
        }

        public List<Station> Full
        {
            get; set;
        }

        public Path(int weight = 0, List<Station> path = null)
        {
            Weight = weight;
            Full = path;
        }
    }
    public class NeighboringStation
    {
        public float Dist
        {
            get; set;
        }

        public Station Station
        {
            get; set;
        }

        public NeighboringStation(float dist, Station station)
        {
            Dist = dist;
            Station = station;
        }
    }
    public class Station
    {
        private static readonly Style style = (Style)Application.Current.MainWindow.FindResource("station");
        private static readonly Style transferStyle = (Style)Application.Current.MainWindow.FindResource("transferStation");
        private static readonly Style select = (Style)Application.Current.MainWindow.FindResource("selectStation");
        public static Ellipse startPoint = new()
        {
            Style = select,
            IsHitTestVisible = false
        };


        public static int NewID
        {
            get; set;
        }
        public string ID { get; }
        public (int x, int y) Position
        {
            get;
        }

        /// <summary>
        /// путь и вес
        /// </summary>
        public Path Path
        {
            get;
        }

        public Line Line { get; }

        private List<Transfer> transfers = new();

        public List<NeighboringStation> Transfers
        {
            get
            {
                List<NeighboringStation> transfers = new();
                this.transfers.ForEach(transfer =>
                {
                    Station station = transfer.Station.st1 != this ? transfer.Station.st1 : transfer.Station.st2;
                    transfers.Add(new NeighboringStation(transfer.Dist, station));
                });
                return transfers;
            }
        }

        public Transfer AddTransfer
        {
            set => transfers.Add(value);
        }

        public Station((int x, int y) position, Line line)
        {
            ID = $"{line.ID}_S{NewID++}";
            Position = position;
            Line = line;

            Path = new Path(int.MaxValue, new List<Station>());
        }

        public NeighboringStation PrevStation
        {
            get; set;
        }

        public NeighboringStation NextStation
        {
            get; set;
        }

        public void Draw()
        {
            Ellipse ellipse = new()
            {
                Style = style,
                ToolTip = ID,
                Cursor = Cursors.Hand,
            };

            ellipse.MouseLeftButtonDown += SelectStation;

            Canvas.SetLeft(ellipse, Position.x);
            Canvas.SetTop(ellipse, Position.y);

            Subway.canvas.Children.Add(ellipse);

            if (transfers.Count > 0)
            {
                Ellipse transfer = new()
                {
                    Style = transferStyle
                };

                Canvas.SetLeft(transfer, Position.x);
                Canvas.SetTop(transfer, Position.y);

                Subway.canvas.Children.Add(transfer);
            }
        }

        public void SelectStation(object sender = null, RoutedEventArgs e = null)
        {
            Canvas.SetLeft(startPoint, Position.x);
            Canvas.SetTop(startPoint, Position.y);

            Subway.stationId.Text = ID;
        }
    }
}