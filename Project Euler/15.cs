using System;

class dkafldjaf
{
	static void Main()
	{
		int a = 0;
		ulong b = 20;
		int d = 0;

		ulong [][] y= new ulong [b][];	
		for (ulong k = 0; k<b ; k++)
		{
			y[k]=new ulong[b];
		}
		
		for (ulong j = 0 ; j<b ; j++)
		{
			y[0][j] = j + 2;
		}		
		
		for ( ulong r = 0 ; r<b ; r++)
		{
			y[r][0] = r + 2;
		}
		
		for (ulong i = 1 ; i<b ; i++)
		{
			for (ulong p = 1; p<b ; p++)
			{
				y[i][p]=y[i-1][p]+y[i][p-1];
				Console.WriteLine(y[i][p]);
			}
		}		
		Console.WriteLine(y[b-1][b-1]);
	//	for (int i = 1 ; i <= 19 ; i++)
	//	{
	//		a=
	//	}
	}		
}