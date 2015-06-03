using System;

class dkafldjaf
{
	static void Main()
	{
		ulong z = 0 ;
		for ( int i = 0 ; i<1e5 ; i++)
		{
			string num = "";
			for( int j = 1 ; ; j++)
			{
				num+=(i*j);
				char[] a = num.ToCharArray();
				if ( a.Length<9 )
				{
					continue;
				}else if (a.Length>9)
				{
					break;
				}else{
					Array.Sort(a);
					int index = 0 ; 
					for ( int m = 0; m<9 ; m++)
					{
						if (Char.GetNumericValue(a[m])!=m+1)
						{
							index++;
							break;
						}
					}
					if (index!=0)
					{
						break;
					}
					ulong x = ulong.Parse(num);
					if (x>z)
					{
						z=x;
					}
				}
			}
		}
		Console.WriteLine(z);
	}
}