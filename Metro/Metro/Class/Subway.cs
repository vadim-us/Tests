using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Metro
{
    public class Subway
    {
        public static readonly TextBox stationId = (TextBox)Application.Current.MainWindow.FindName("stationID");
        public static readonly Canvas canvas = (Canvas)Application.Current.MainWindow.FindName("canvas");
        public static readonly Canvas canvasPath = (Canvas)Application.Current.MainWindow.FindName("canvasPath");
        public static readonly TextBlock path = (TextBlock)Application.Current.MainWindow.FindName("path");
        public static readonly Button start = (Button)Application.Current.MainWindow.FindName("start");
        public static readonly ComboBox map = (ComboBox)Application.Current.MainWindow.FindName("map");
        public static readonly StackPanel load = (StackPanel)Application.Current.MainWindow.FindName("load");

        /// <summary>
        /// линии
        /// </summary>
        private List<Line> lines;
        /// <summary>
        /// все станции
        /// </summary>
        private List<Station> allStations;
        /// <summary>
        /// пересадки
        /// </summary>
        private List<Transfer> transfers;

        public Subway()
        {
            start.Click += Submit;

            canvasPath.Children.Add(Station.startPoint);
        }

        private async void Submit(object sender, RoutedEventArgs e)
        {
            start.IsEnabled = false;
            canvas.IsEnabled = false;
            map.IsEnabled = false;

            ClearCanvas();

            Station station = allStations.Find(s => s.ID == stationId.Text);

            ScrollViewer scrollPath = (ScrollViewer)path.Parent;

            load.Visibility = Visibility.Visible;
            scrollPath.Visibility = Visibility.Collapsed;
            List<Station> fullPath = await Task.Run(() => VisitAllLines(station));
            load.Visibility = Visibility.Collapsed;
            scrollPath.Visibility = Visibility.Visible;

            DrawPath(fullPath);

            List<string> outPath = fullPath.ConvertAll(a => a.ID);
            path.Text = string.Join(" --> ", outPath);

            start.IsEnabled = true;
            canvas.IsEnabled = true;
            map.IsEnabled = true;
        }

        /// <summary>
        /// создание схемы метро на основе входных данных
        /// </summary>
        /// <param name="inputData"></param>
        public void Bild(((SolidColorBrush color, (int x, int y)[] stations)[] lines, (string st1, string st2)[] transfers) inputData)
        {
            lines = new();
            allStations = new();
            transfers = new();

            Create(inputData);
            Draw(inputData);
        }

        private void Create(((SolidColorBrush color, (int x, int y)[] stations)[] lines, (string st1, string st2)[] transfers) inputData)
        {
            Line.NewID = 0;

            foreach (var line in inputData.lines)
            {
                Station.NewID = 0;

                Station prev = null;
                int i = 0;

                Line newLine = new Line(line.color);
                lines.Add(newLine);

                foreach (var stationPos in line.stations)
                {
                    newLine.Points.Add(new Point(stationPos.x, stationPos.y));

                    Station newStation = new Station(stationPos, newLine);

                    allStations.Add(newStation);
                    newLine.Stations.Add(newStation);

                    if (i++ != 0)
                    {
                        float distance = (float)Math.Ceiling(Math.Sqrt(Math.Pow(stationPos.x - prev.Position.x, 2) + Math.Pow(stationPos.y - prev.Position.y, 2)));

                        newStation.PrevStation = new(distance, prev);
                        prev.NextStation = new(distance, newStation);
                    }
                    prev = newStation;
                }
            }

            foreach (var transfer in inputData.transfers)
            {
                Station st1 = allStations.Find(station => station.ID == transfer.st1.ToUpper());
                Station st2 = allStations.Find(station => station.ID == transfer.st2.ToUpper());

                int x1 = st1 != null ? st1.Position.x : 0;
                int y1 = st1 != null ? st1.Position.y : 0;

                int x2 = st2 != null ? st2.Position.x : 0;
                int y2 = st2 != null ? st2.Position.y : 0;

                float distance = (float)Math.Ceiling(Math.Sqrt(Math.Pow(x1 - x2, 2) + Math.Pow(y1 - y2, 2)));

                Transfer newLink = new Transfer(distance, (st1, st2));

                if (st1 != null) st1.AddTransfer = newLink;
                if (st2 != null) st2.AddTransfer = newLink;

                transfers.Add(newLink);
            }
        }

        private void Draw(((SolidColorBrush color, (int x, int y)[] stations)[] lines, (string st1, string st2)[] links) inputData)
        {
            ClearCanvas();

            canvas.Children.Clear();

            foreach (var line in lines)
            {
                line.Draw();
            }

            foreach (var station in allStations)
            {
                station.Draw();
            }

            allStations[0].SelectStation();

            foreach (var transfer in transfers)
            {
                transfer.Draw();
            }
        }

        private static void ClearCanvas()
        {
            UIElement startPoint = canvasPath.Children[0];
            canvasPath.Children.Clear();
            canvasPath.Children.Add(startPoint);
        }


        /// <summary>
        /// поиск кротчайшего пути с посещением всех линий
        /// </summary>
        /// <param name="start">начальная станция</param>
        private List<Station> VisitAllLines(Station start)
        {
            lines.ForEach(line =>
            {
                line.Visited = false;
            });

            List<Station> path = new();
            List<Line> unVisitedLine = lines.ToList();
            Station station = start;            

            while (true)
            {
                // удаляет текущею линию
                unVisitedLine = unVisitedLine.FindAll(line => line.ID != station.Line.ID);

                // удаляет посещенные линии
                unVisitedLine = unVisitedLine.FindAll(line => line.Visited != true);

                // прекратить цикл если не осталось непосешенных линий
                if (unVisitedLine.Count == 0) break;

                FindShortWay(station);

                // ближайшие пересадки
                List<Station> nearestTransferStations = new();

                unVisitedLine.ForEach(line =>
                {
                    // только станции с пересадками
                    List<Station> transferStations = line.Stations.FindAll(
                      station => station.Transfers.Count > 0
                    );

                    // добавление ближайшей на линии
                    nearestTransferStations.AddRange(transferStations);
                });

                // сортировка по весу
                nearestTransferStations.Sort((a, b) => (int)(a.Path.Weight - b.Path.Weight));

                // следующей становится самая ближайшая
                station = nearestTransferStations[0];

                // 
                List<Station> newPath = station.Path.Full;

                newPath.ForEach(station =>
                {
                    station.Line.Visited = true;
                });

                path.AddRange(newPath);
            }

            path.Add(station);

            return path;
        }

        /// <summary>
        /// поиск кротчайшего пути от текущей станции до каждой
        /// </summary>
        /// <param name="current"></param>
        private void FindShortWay(Station current)
        {
            // сброс просчитанных путей
            allStations.ForEach(station =>
            {
                station.Path.Weight = int.MaxValue;
                station.Path.Full = new List<Station>();
            });

            // устанавливает начальной станции вес в 0
            current.Path.Weight = 0;

            Queue<Station> queue = new();

            while (true)
            {
                List<NeighboringStation> possibleWays = new();
                NeighboringStation prev = current.PrevStation;
                NeighboringStation next = current.NextStation;
                List<NeighboringStation> transfers = current.Transfers;

                if (prev != null) possibleWays.Add(prev);

                if (next != null) possibleWays.Add(next);

                if (transfers != null) possibleWays.AddRange(transfers);

                Debug.WriteLine($"\ncurent {current.ID}, W= {current.Path.Weight}");

                List<string> a = possibleWays.ConvertAll(a => $"ID= {a.Station.ID}, W= {a.Station.Path.Weight}");
                Debug.WriteLine($"possibleWays {possibleWays.Count}= {string.Join("; ", a)}");

                if (possibleWays.Count > 0)
                {
                    possibleWays.Sort((a, b) => (int)(a.Dist - b.Dist));

                    possibleWays.ForEach(way =>
                    {
                        float newWeight = current.Path.Weight + way.Dist;
                        float oldWeight = way.Station.Path.Weight;

                        Debug.WriteLine($"way {way.Station.ID} new W= {newWeight}, old W= {oldWeight}");

                        // добавление в очередь любой станции если путь стал короче
                        if (newWeight < oldWeight)
                        {
                            way.Station.Path.Weight = newWeight;

                            List<Station> newPath = current.Path.Full.ToList();
                            newPath.Add(current);

                            way.Station.Path.Full = newPath;

                            queue.Enqueue(way.Station);
                            Debug.WriteLine($"{way.Station.ID} add to queue");
                        }
                    });
                }

                if (queue.Count > 0)
                {
                    current = queue.Dequeue();
                }
                else
                {
                    break;
                }
            }

            Debug.WriteLine($"\nallStations");
            allStations.ForEach(s =>
            {
                List<string> d = s.Path.Full.ConvertAll(p => $"ID= {p.ID}, W= {p.Path.Weight}");
                Debug.WriteLine($"\n{s.ID} Path {s.Path.Full.Count}= {string.Join("; ", d)}");
            });
        }

        /// <summary>
        /// отрисовка пути
        /// </summary>
        private void DrawPath(List<Station> path)
        {
            PointCollection points = new();

            path.ForEach(station =>
            {
                points.Add(new Point(station.Position.x, station.Position.y));
            });

            Polyline polyline = new()
            {
                Points = points,
                Stroke = new SolidColorBrush(Colors.Black),
                StrokeThickness = 8,
                StrokeEndLineCap = PenLineCap.Triangle,
                StrokeStartLineCap = PenLineCap.Round,
                StrokeLineJoin = PenLineJoin.Round,
                IsHitTestVisible = false
            };

            Panel.SetZIndex(polyline, 2);

            canvasPath.Children.Add(polyline);
        }
    }
}