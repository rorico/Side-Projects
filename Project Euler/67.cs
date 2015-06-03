using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		StreamReader sr = new StreamReader("triangle.txt");
		string[][] num = new string[100][];
		for ( int i = 0 ; i < 100 ; i++)
		{
			num[i] = sr.ReadLine().Split(' ');
		}
		int[][] x = new int[100][];
		for ( int i = 0 ; i < 100 ; i++)
		{
			x[i] = new int[i+1];
			for ( int j = 0 ; j<x[i].Length ; j++)
			{
				x[i][j] = int.Parse(num[i][j]);
			}
		}
		int[] value = new int[100];
		value[0] = x[1][0]+x[0][0];
		value[1] = x[1][1]+x[0][0];
		
		int[] value1 = new int[100];
		for ( int i = 2 ; i< 100 ; i++ )
		{
			int spot = 0;
			
			for ( int j = 0 ; j<=i ; j++ )
			{
				if (spot == 0)
				{
					value1[0]=value[0]+x[i][0];
				} else if (spot == i) {
					value1[spot] = value[spot-1]+x[i][spot];
				} else {
					int max = value[spot-1]+x[i][spot];
					int min = value[spot] + x[i][spot];
					if ( max >min)
					{
						value1[spot] = max;
					} else {
						value1[spot] = min;
					}
				}
				spot++;
			}
			for ( int l = 0 ; l< 100 ; l++)
			{
				value[l]=value1[l];
			}
			//value = value1;
		}
		int count = 0;
		foreach( int y in value)
		{
			Console.WriteLine(y+" "+count);
			count++;
		}
		int cnt = 0; 
		for ( int i = 0 ; i<100 ; i++)
		{
			cnt+=x[i][0];
		}
		Console.WriteLine(cnt);
		Array.Sort(value);
		Console.WriteLine(value[99]);
			
	}
	//static int xx (int x, int y, int[][] a, int z)
	//{
	//	if ( y == 99)
	//	{
	//		return a[99][x];
	//	}
	//	
	//}
	//static void(int startx, int starty, int end , out int[]value )
	//{
	//
	//}
	//static void next(int[] a, int startx, int starty, out int max, out min)
	//{
	//	if (a[startx+1][y]>a[startx+1][y+1])
	//	{
	//		max = y;
	//		min = y+1;
	//	} else {
	//		max = y+1;
	//		min = y;
	//	}
	//}
	//static int next(int[] a, int startx, int starty)
	//{
		
}