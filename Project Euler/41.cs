using System;

class dkafldjaf
{
	static void Main()
	{
		int y = 0;
		int[] x = {0,1,2,3,4,5,6,7,8,9};
		for (int a = 0 ; a<1 ; a++)
		{
			for (int b = 0 ; b<1 ; b++)
			{
				//if (b==a)
				//{
				//	continue;
				//}
				for (int c = 0 ; c<1 ; c++)
				{
	//				if (c==a||c==b)
	//				{
	//					continue;
	//				}
					for (int d = 0 ; d<8 ; d++)
					{
						if (d==a||d==b||d==c)
						{
							continue;
						}
						for (int e = 0 ; e<8 ; e++)
						{
							if (e==a||e==b||e==c||e==d)
							{
								continue;
							}
							for (int f = 0 ; f<8; f++)
							{
								if (f==a||f==b||f==c||f==d||f==e)
								{
									continue;
								}
								for (int g = 0 ; g<8 ; g++)
								{
									if (g==a||g==b||g==c||g==d||g==e||g==f)
									{
										continue;
									}
									for (int h = 0 ; h<8 ; h++)
									{
										if (h==a||h==b||h==c||h==d||h==e||h==f||h==g)
										{
											continue;
										}
										for (int i = 0 ; i<8 ; i++)
										{
											if (i==a||i==b||i==c||i==d||i==e||i==f||i==g||i==h)
											{
												continue;
											}
											for (int j = 0 ; j<8 ; j++)
											{
												if (j==a||j==b||j==c||j==d||j==e||j==f||j==g||j==h||j==i)
												{
													continue;
												}
												double s = /*a*1e9+b*1e8+c*1e7*/+d*1e6+e*1e5+f*1e4+g*1e3+h*1e2+i*1e1+j;
												//Console.WriteLine(s);	
												if (prime(s))
												{
													Console.WriteLine(s);
													break;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}		
	static bool prime(double x)
	{
		if (x<2)
		{
			return false;
		}
		for(int i = 2; i<= (int)Math.Sqrt(x) ; i++)
		{
			if (x%i==0)
			{
				return false;
			}
		}
		return true;
	}
}