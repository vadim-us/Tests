using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace Metro
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly Subway subway;
        public MainWindow()
        {
            InitializeComponent();

            double primaryScreenWidth = SystemParameters.PrimaryScreenWidth;

            window.Left = primaryScreenWidth - window.Width - 10;

            subway = new Subway();

            map.SelectedIndex = 0;
        }

        private void ChangeMap(object sender, SelectionChangedEventArgs e)
        {
            subway.Bild(Graf.inputData[map.SelectedIndex]);
        }

        private void FindWay(object sender, RoutedEventArgs e)
        {
            Debug.WriteLine("FindWay");
        }
    }
}
