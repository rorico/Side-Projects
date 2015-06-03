using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		StreamReader sr = new StreamReader("matrix.txt");
		string[][] num = new string[80][];
		for ( int i = 0 ; i < 80 ; i++)
		{
			num[i] = sr.ReadLine().Split(',');
		}
		Console.WriteLine(num.Length);
		Console.WriteLine(num[0].Length);
		int[][] x = new int[159][];
		int cnt = 1;
		int hor = 0;
		int ver = 0;
		for ( int i = 0 ; i < 159 ; i++)
		{
			x[i] = new int[cnt];
			if(i<79)
			{
				hor = i;
				ver = 0;
				cnt++;
			} else {
				hor = 79;
				ver = i-79;
				cnt--;
				
			}
			
			for ( int j = 0 ; j<x[i].Length ; j++)
			{
				x[i][j] = int.Parse(num[hor][ver]);
				hor--;
				ver++;
				
			}
		}
		/*foreach (int[] array in x)
		{
			Console.WriteLine(array.Length);
			//foreach ( int num2 in array )
			//{
			//	Console.Write( num2 + " " );
			//}
			//Console.WriteLine();
		}*/
		int[] value = new int[80];
		value[0] = x[1][0]+x[0][0];
		value[1] = x[1][1]+x[0][0];
		
		int[] value1 = new int[80];
		for ( int i = 2 ; i< 159 ; i++ )
		{
			int spot = 0;
			if(i<80){
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
					if ( max <min)
					{
						value1[spot] = max;
					} else {
						value1[spot] = min;
					}
				}
				spot++;
			}
			} else {
				for ( int j = 0 ; j<159-i ; j++ )
				{
						int max = value[spot+1]+x[i][spot];
						int min = value[spot] + x[i][spot];
						if ( max <min)
						{
							value1[spot] = max;
						} else {
							value1[spot] = min;
						}
						spot++;
				}
			}
			for ( int l = 0 ; l< 80 ; l++)
			{
				value[l]=value1[l];
			}
		}
		int count = 0;
		foreach( int y in value)
		{
			Console.WriteLine(y+" "+count);
			count++;
		}
		int cnt2 = 0; 
		for ( int i = 0 ; i<80 ; i++)
		{
			cnt2+=x[i][0];
		}
		Console.WriteLine(cnt2);
		Array.Sort(value);
		Console.WriteLine(value[79]);
			
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