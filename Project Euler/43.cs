using System;

class dkafldjaf
{
	static void Main()
	{
		long x = 0;
		long y = 0;
		//int[] x = {0,1,2,3,4,5,6,7,8,9};
		for (int a = 0 ; a<10 ; a++)
		{
			for (int b = 0 ; b<10 ; b++)
			{
				if (b==a)
				{
					continue;
				}
				for (int c = 0 ; c<10 ; c++)
				{
					if (c==a||c==b)
					{
						continue;
					}
					for (int d = 0 ; d<10 ; d++)
					{
						if (d==a||d==b||d==c)
						{
							continue;
						}
						for (int e = 0 ; e<10 ; e++)
						{
							if (e==a||e==b||e==c||e==d)
							{
								continue;
							}
							for (int f = 0 ; f<10 ; f++)
							{
								if (f==a||f==b||f==c||f==d||f==e)
								{
									continue;
								}
								for (int g = 0 ; g<10 ; g++)
								{
									if (g==a||g==b||g==c||g==d||g==e||g==f)
									{
										continue;
									}
									for (int h = 0 ; h<10 ; h++)
									{
										if (h==a||h==b||h==c||h==d||h==e||h==f||h==g)
										{
											continue;
										}
										for (int i = 0 ; i<10 ; i++)
										{
											if (i==a||i==b||i==c||i==d||i==e||i==f||i==g||i==h)
											{
												continue;
											}
											for (int j = 0 ; j<10 ; j++)
											{
												if (j==a||j==b||j==c||j==d||j==e||j==f||j==g||j==h||j==i)
												{
													continue;
												}
												y=(long)(1e9*a+1e8*b+1e7*c+1e6*d+1e5*e+1e4*f+1e3*g+1e2*h+1e1*i+j);
												double n1 = 1e2*b+10*c+d;
												if (n1%2!=0)
												{
													continue;
												}
												double n2 = 1e2*c+10*d+e;
												if (n2%3!=0)
												{
													continue;
												}
												double n3 = 1e2*d+10*e+f;
												if (n3%5!=0)
												{
													continue;
												}
												double n4 = 1e2*e+10*f+g;
												if (n4%7!=0)
												{
													continue;
												}
												double n5 = 1e2*f+10*g+h;
												if (n5%11!=0)
												{
													continue;
												}
												double n6 = 1e2*g+10*h+i;
												if (n6%13!=0)
												{
													continue;
												}
												double n7 = 1e2*h+10*i+j;
												if (n7%17!=0)
												{
													continue;
												}
												x+=y;
												
												
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
		Console.WriteLine(x);
	}		
}