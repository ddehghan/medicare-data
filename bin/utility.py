__author__ = 'daviddehghan'


def round_(amount):
    """
    Round up a number to nearest 1000
    """
    if amount >= 0:
        if amount % 1000 < 500:
            return amount - (amount % 500)
        else:
            return amount - (amount % 500) + 500

    else:
        if -amount % 1000 < 500:
            return -amount - (-amount % 500)
        else:
            return -amount - (-amount % 500) + 500


def scale(val, src, dst):
    """
    Scale the given value from the scale of src to the scale of dst.
    """
    return ((val - src[0]) / (src[1] - src[0])) * (dst[1] - dst[0]) + dst[0]