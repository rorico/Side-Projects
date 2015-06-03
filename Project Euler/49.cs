using System;

class dkafldjaf
{
	static void Main()
	{
		for ( int i = 1000 ; i< 10000; i++)
		{
			string s = Convert.ToString(i);
			char[] a = s.ToCharArray();
			int[] num = new int[6];
			for ( int j = 0; j<4; j++)
			{
				for (int k = 0; k<4 ; k++)
				{
					for (int m = 0 ; m<4 ; m++)
					{
						for (int n = 0 ; n<4 ; n++)
						{
							if (j==k||j==m||j==n||k==m||k==n||m==n)
							{
								break;
							}
							string b = (a[j]+"")+(a[k]+"")+(a[m]+"")+(a[n]+"");
							int y = int.Parse(b);
							for (int p = 0 ; p<6 ; p++)
							{
								if (num[p]==0)
								{
									num[p]=y;
									break;
								}else{
									continue;
								}
							}
							//Console.WriteLine(y);
							//Console.WriteLine("{0}{1}{2}{3}",a[j],a[k],a[m],a[n]);
						}
					}
				}
			}
			for ( int j = 0; j<6; j++)
			{
				for (int k = 0; k<6 ; k++)
				{
					for (int m = 0 ; m<6 ; m++)
					{
						if (num[j]==num[k])
						{
							break;
						}
						if (j==k||j==m||k==m)
						{
							break;
						}
						if (num[j]-num[k]==num[k]-num[m])
						{
							if (prime(num[j])&&prime(num[k])&&prime(num[m]))
							{
								Console.WriteLine("{0} {1} {2}",num[j],num[k],num[m]);
							}
						}
					}
				}
			}
			
		}
	}		
	static bool prime(int x)
	{
		double y=(double)x;
		if (x<2)
		{
			return false;
		}
		for(int i = 2; i<= (int)Math.Sqrt(y) ; i++)
		{
			if (x%i==0)
			{
				return false;
			}
		}
		return true;
	}
}